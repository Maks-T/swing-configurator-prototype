import { TriangleAlert } from 'lucide-react';
import { useMemo, useState } from 'react';

import { useDoorData } from '@/entities/door-catalog';
import { useSwingProjectStore } from '@/entities/swing-project';
import { cn, formatMoney, formatQty } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import { NumberField } from '@/shared/ui/number-field';
import { FieldRow, PanelSection } from '@/shared/ui/panel-section';
import { TreeTable, type TreeTableColumn } from '@/shared/ui/tree-table';

import { collectPlaceholders, toTreeNodes } from '../lib/to-tree-nodes';

import type { DoorSetup, EstimateNode } from '@calculation/door-kit';
import type { SwingResult } from '@calculation/swing';

type EstimatePanelProps = { setup: DoorSetup; result: SwingResult };

/** Смета двери в колонках легаси (кол-во, цена, наценка, сумма, С/С), итоги и проверки */
export function EstimatePanel({ setup, result }: EstimatePanelProps) {
  const data = useDoorData();
  const patch = useSwingProjectStore.use.patch();
  const [showCost, setShowCost] = useState(false);
  const { totals } = result;
  const money = (v: number) => formatMoney(v, totals.currency);
  const tree = useMemo(() => toTreeNodes(result.estimate.children), [result.estimate]);
  const placeholders = useMemo(
    () => collectPlaceholders(result.estimate.children),
    [result.estimate]
  );
  const warnings = [...result.sizeIssues.map((i) => i.message), ...result.warnings];

  const columns: TreeTableColumn<EstimateNode>[] = [
    {
      id: 'name',
      header: 'Наименование',
      width: 'minmax(16rem,1fr)',
      cell: (node, ctx) => (
        <span
          className={cn(
            'calc:truncate',
            ctx.isGroup && 'calc:font-medium',
            node.data.isPlaceholder && 'calc:text-destructive'
          )}
          title={node.data.sku}
        >
          {node.data.prefix ? (
            <span className="calc:text-muted-foreground">{node.data.prefix} </span>
          ) : null}
          {node.data.name}
        </span>
      ),
    },
    {
      id: 'qty',
      header: 'Кол-во',
      width: '6.5rem',
      className: 'calc:justify-end calc:tabular-nums',
      cell: (node) => `${formatQty(node.data.qty)} ${node.data.unit}`,
    },
    {
      id: 'price',
      header: 'Цена',
      width: '6.5rem',
      className: 'calc:justify-end calc:tabular-nums',
      cell: (node, ctx) => (ctx.isGroup ? '' : money(node.data.price)),
    },
    {
      id: 'margin',
      header: 'Нац.',
      width: '4rem',
      className: 'calc:justify-end calc:tabular-nums calc:text-muted-foreground',
      cell: (node, ctx) => (ctx.isGroup ? '' : `${node.data.marginPercent}%`),
    },
    {
      id: 'cost',
      header: 'С/С',
      width: '6.5rem',
      hidden: !showCost,
      className: 'calc:justify-end calc:tabular-nums calc:text-muted-foreground',
      cell: (node) => money(node.data.total.base),
    },
    {
      id: 'total',
      header: 'Сумма',
      width: '7rem',
      className: 'calc:justify-end calc:tabular-nums',
      cell: (node, ctx) => (
        <span className={cn(ctx.isGroup && 'calc:font-medium')}>
          {money(node.data.total.price)}
        </span>
      ),
    },
  ];

  return (
    <div className="calc:flex calc:size-full calc:min-h-0 calc:flex-row">
      <div className="calc:min-h-0 calc:flex-1 calc:overflow-auto">
        <TreeTable columns={columns} data={tree} defaultOpen empty="Нет позиций" />
      </div>

      <aside className="calc:flex calc:w-80 calc:shrink-0 calc:flex-col calc:overflow-auto calc:border-l">
        <PanelSection
          title="Итого"
          actions={
            <label className="calc:flex calc:items-center calc:gap-1.5 calc:text-xs calc:text-muted-foreground">
              <input
                type="checkbox"
                className="calc:accent-primary"
                checked={showCost}
                onChange={() => {
                  setShowCost((v) => !v);
                }}
              />
              С/С
            </label>
          }
        >
          <FieldRow label="Наценка">
            <NumberField
              value={setup.margin}
              suffix="%"
              onCommit={(v) => {
                patch({ margin: Math.max(0, v) }, data);
              }}
            />
          </FieldRow>
          <FieldRow label="Скидка">
            <NumberField
              value={setup.discount}
              suffix="%"
              onCommit={(v) => {
                patch({ discount: Math.min(100, Math.max(0, v)) }, data);
              }}
            />
          </FieldRow>
          <dl className="calc:grid calc:grid-cols-[1fr_auto] calc:gap-x-3 calc:gap-y-0.5 calc:text-sm calc:tabular-nums">
            {result.estimate.children.map((group) => (
              <div key={group.id} className="calc:contents">
                <dt
                  className="calc:truncate calc:text-muted-foreground"
                  title={group.name}
                >
                  {group.prefix || group.name.split(':')[0]}
                </dt>
                <dd className="calc:text-right">{money(group.total.price)}</dd>
              </div>
            ))}
            <dt className="calc:text-muted-foreground">Розница</dt>
            <dd className="calc:text-right">{money(totals.retail)}</dd>
            {showCost ? (
              <>
                <dt className="calc:text-muted-foreground">Себестоимость</dt>
                <dd className="calc:text-right">{money(totals.cost)}</dd>
              </>
            ) : null}
            <dt className="calc:font-semibold">К оплате</dt>
            <dd className="calc:text-right calc:text-base calc:font-semibold calc:text-primary">
              {money(totals.final)}
            </dd>
          </dl>
        </PanelSection>

        <PanelSection
          title="Проверки"
          actions={
            warnings.length + placeholders.length > 0 ? (
              <Badge variant="destructive">{warnings.length + placeholders.length}</Badge>
            ) : (
              <Badge variant="secondary">OK</Badge>
            )
          }
        >
          <ul className="calc:flex calc:max-h-48 calc:flex-col calc:gap-1 calc:overflow-auto calc:text-xs">
            {warnings.map((w, i) => (
              <li key={`${i}-${w}`} className="calc:flex calc:gap-1.5">
                <TriangleAlert className="calc:mt-0.5 calc:size-3 calc:shrink-0 calc:text-destructive" />
                <span>{w}</span>
              </li>
            ))}
            {placeholders.map((name) => (
              <li
                key={name}
                className="calc:flex calc:gap-1.5 calc:text-muted-foreground"
              >
                <TriangleAlert className="calc:mt-0.5 calc:size-3 calc:shrink-0" />
                <span>Нет цены: {name}</span>
              </li>
            ))}
            {warnings.length === 0 && placeholders.length === 0 ? (
              <li className="calc:text-muted-foreground">Ошибок нет</li>
            ) : null}
          </ul>
        </PanelSection>
      </aside>
    </div>
  );
}
