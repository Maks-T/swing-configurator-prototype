import { Slider as SliderPrimitive } from '@base-ui/react/slider';

import { cn } from '@/shared/lib/utils/index';

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderPrimitive.Root.Props) {
  const _values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min, max];

  return (
    <SliderPrimitive.Root
      className={cn('calc:data-horizontal:w-full calc:data-vertical:h-full', className)}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="calc:relative calc:flex calc:w-full calc:touch-none calc:items-center calc:select-none calc:data-disabled:opacity-50 calc:data-vertical:h-full calc:data-vertical:min-h-40 calc:data-vertical:w-auto calc:data-vertical:flex-col">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="calc:relative calc:grow calc:overflow-hidden calc:rounded-full calc:bg-input/90 calc:select-none calc:data-horizontal:h-2 calc:data-horizontal:w-full calc:data-vertical:h-full calc:data-vertical:w-2"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="calc:bg-primary calc:select-none calc:data-horizontal:h-full calc:data-vertical:w-full"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="calc:block calc:h-4 calc:w-6 calc:shrink-0 calc:rounded-full calc:bg-white calc:shadow-md calc:ring-1 calc:ring-black/10 calc:transition-[color,box-shadow,background-color] calc:select-none calc:not-dark:bg-clip-padding calc:hover:ring-4 calc:hover:ring-ring/30 calc:focus-visible:ring-4 calc:focus-visible:ring-ring/30 calc:focus-visible:outline-hidden calc:disabled:pointer-events-none calc:disabled:opacity-50 calc:data-vertical:h-6 calc:data-vertical:w-4"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export { Slider };
