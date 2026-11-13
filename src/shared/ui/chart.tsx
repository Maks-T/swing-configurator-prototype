import * as React from 'react';
import * as RechartsPrimitive from 'recharts';

import { cn } from '@/shared/lib/utils';

import type { TooltipValueType } from 'recharts';

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: '', dark: '.dark' } as const;

const INITIAL_DIMENSION = { width: 320, height: 200 } as const;
type TooltipNameType = number | string;

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
>;

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }

  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  initialDimension = INITIAL_DIMENSION,
  ...props
}: React.ComponentProps<'div'> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >['children'];
  initialDimension?: {
    width: number;
    height: number;
  };
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, '')}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          'calc:flex calc:aspect-video calc:justify-center calc:text-xs calc:[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground calc:[&_.recharts-cartesian-grid_line[stroke=#ccc]]:stroke-border/50 calc:[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border calc:[&_.recharts-dot[stroke=#fff]]:stroke-transparent calc:[&_.recharts-layer]:outline-hidden calc:[&_.recharts-polar-grid_[stroke=#ccc]]:stroke-border calc:[&_.recharts-radial-bar-background-sector]:fill-muted calc:[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted calc:[&_.recharts-reference-line_[stroke=#ccc]]:stroke-border calc:[&_.recharts-sector]:outline-hidden calc:[&_.recharts-sector[stroke=#fff]]:stroke-transparent calc:[&_.recharts-surface]:outline-hidden',
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer initialDimension={initialDimension}>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme ?? config.color
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ?? itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join('\n')}
}
`
          )
          .join('\n'),
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = 'dot',
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
  valueFormatter,
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<'div'> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: 'line' | 'dot' | 'dashed';
    nameKey?: string;
    labelKey?: string;
    valueFormatter?: (value: number) => React.ReactNode;
  } & Omit<
    RechartsPrimitive.DefaultTooltipContentProps<TooltipValueType, TooltipNameType>,
    'accessibilityLayer'
  >) {
  const { config } = useChart();

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null;
    }

    const [item] = payload;
    const key =
      toChartConfigKey(labelKey) ??
      toChartConfigKey(item?.dataKey) ??
      toChartConfigKey(item?.name) ??
      'value';
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === 'string'
        ? (config[label]?.label ?? label)
        : itemConfig?.label;

    if (labelFormatter) {
      return (
        <div className={cn('calc:font-medium', labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      );
    }

    if (!value) {
      return null;
    }

    return <div className={cn('calc:font-medium', labelClassName)}>{value}</div>;
  }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

  if (!active || !payload?.length) {
    return null;
  }

  const nestLabel = payload.length === 1 && indicator !== 'dot';

  return (
    <div
      className={cn(
        'calc:grid calc:min-w-32 calc:items-start calc:gap-1.5 calc:rounded-xl calc:bg-popover calc:px-2.5 calc:py-1.5 calc:text-xs calc:text-popover-foreground calc:shadow-lg calc:ring-1 calc:ring-foreground/5 calc:dark:ring-foreground/10',
        className
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="calc:grid calc:gap-1.5">
        {payload
          .filter((item) => item.type !== 'none')
          .map((item, index) => {
            const key =
              toChartConfigKey(nameKey) ??
              toChartConfigKey(item.name) ??
              toChartConfigKey(item.dataKey) ??
              'value';
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color ?? getNestedFill(item) ?? item.color;

            return (
              <div
                key={index}
                className={cn(
                  'calc:flex calc:w-full calc:flex-wrap calc:items-stretch calc:gap-2 calc:[&>svg]:h-2.5 calc:[&>svg]:w-2.5 calc:[&>svg]:text-muted-foreground',
                  indicator === 'dot' && 'calc:items-center'
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            'calc:shrink-0 calc:rounded-[2px] calc:border-(--color-border) calc:bg-(--color-bg)',
                            {
                              'calc:h-2.5 calc:w-2.5': indicator === 'dot',
                              'calc:w-1': indicator === 'line',
                              'calc:w-0 calc:border-[1.5px] calc:border-dashed calc:bg-transparent':
                                indicator === 'dashed',
                              'calc:my-0.5': nestLabel && indicator === 'dashed',
                            }
                          )}
                          style={
                            {
                              '--color-bg': indicatorColor,
                              '--color-border': indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        'calc:flex calc:flex-1 calc:justify-between calc:leading-none',
                        nestLabel ? 'calc:items-end' : 'calc:items-center'
                      )}
                    >
                      <div className="calc:grid calc:gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="calc:text-muted-foreground">
                          {itemConfig?.label ?? item.name}
                        </span>
                      </div>
                      {item.value !== undefined && item.value !== null && (
                        <span className="calc:font-mono calc:font-medium calc:text-foreground calc:tabular-nums">
                          {typeof item.value === 'number'
                            ? (valueFormatter?.(item.value) ??
                              item.value.toLocaleString())
                            : String(item.value)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

const ChartLegend = RechartsPrimitive.Legend;

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = 'bottom',
  nameKey,
}: React.ComponentProps<'div'> & {
  hideIcon?: boolean;
  nameKey?: string;
} & RechartsPrimitive.DefaultLegendContentProps) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        'calc:flex calc:items-center calc:justify-center calc:gap-4',
        verticalAlign === 'top' ? 'calc:pb-3' : 'calc:pt-3',
        className
      )}
    >
      {payload
        .filter((item) => item.type !== 'none')
        .map((item, index) => {
          const key =
            toChartConfigKey(nameKey) ?? toChartConfigKey(item.dataKey) ?? 'value';
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <div
              key={index}
              className={cn(
                'calc:flex calc:items-center calc:gap-1.5 calc:[&>svg]:h-3 calc:[&>svg]:w-3 calc:[&>svg]:text-muted-foreground'
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="calc:h-2 calc:w-2 calc:shrink-0 calc:rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          );
        })}
    </div>
  );
}

function toChartConfigKey(value: unknown): string | undefined {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }
  return undefined;
}

function getNestedFill(item: object): string | undefined {
  if (!('payload' in item)) {
    return undefined;
  }

  const nested = item.payload;
  if (typeof nested !== 'object' || nested === null || !('fill' in nested)) {
    return undefined;
  }

  const { fill } = nested;
  if (typeof fill === 'string') {
    return fill;
  }
  return undefined;
}

function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== 'object' || payload === null) {
    return;
  }

  const payloadPayload =
    'payload' in payload &&
    typeof payload.payload === 'object' &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (key in payload && typeof payload[key as keyof typeof payload] === 'string') {
    configLabelKey = payload[key as keyof typeof payload];
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === 'string'
  ) {
    configLabelKey = payloadPayload[key as keyof typeof payloadPayload];
  }

  return configLabelKey in config ? config[configLabelKey] : config[key];
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
