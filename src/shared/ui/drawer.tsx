import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer';
import * as React from 'react';

import { cn } from '@/shared/lib/utils/index';

type DrawerContextProps = {
  hasSnapPoints: boolean;
  modal: DrawerPrimitive.Root.Props['modal'];
  showSwipeHandle: boolean;
  swipeDirection: NonNullable<DrawerPrimitive.Root.Props['swipeDirection']>;
};

const DrawerContext = React.createContext<DrawerContextProps | null>(null);

function useDrawer() {
  const context = React.useContext(DrawerContext);

  if (!context) {
    throw new Error('useDrawer must be used within a Drawer.');
  }

  return context;
}

function Drawer({
  modal = true,
  showSwipeHandle = false,
  snapPoints,
  swipeDirection = 'down',
  ...props
}: DrawerPrimitive.Root.Props & {
  showSwipeHandle?: boolean;
}) {
  const hasSnapPoints = (snapPoints?.length ?? 0) > 0;
  const contextValue = React.useMemo(
    () => ({ hasSnapPoints, modal, showSwipeHandle, swipeDirection }),
    [hasSnapPoints, modal, showSwipeHandle, swipeDirection]
  );

  return (
    <DrawerContext.Provider value={contextValue}>
      <DrawerPrimitive.Root
        data-slot="drawer"
        modal={modal}
        snapPoints={snapPoints}
        swipeDirection={swipeDirection}
        {...props}
      />
    </DrawerContext.Provider>
  );
}

function DrawerTrigger({ ...props }: DrawerPrimitive.Trigger.Props) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({ ...props }: DrawerPrimitive.Portal.Props) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({ ...props }: DrawerPrimitive.Close.Props) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({ className, ...props }: DrawerPrimitive.Backdrop.Props) {
  return (
    <DrawerPrimitive.Backdrop
      data-slot="drawer-overlay"
      className={cn(
        'calc:fixed calc:inset-0 calc:z-50 calc:min-h-dvh calc:bg-black/30 calc:opacity-[max(var(--drawer-overlay-min-opacity,0),calc(1-var(--drawer-swipe-progress)))] calc:transition-opacity calc:duration-450 calc:ease-[cubic-bezier(0.32,0.72,0,1)] calc:select-none calc:data-ending-style:pointer-events-none calc:data-ending-style:opacity-0 calc:data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] calc:data-snap-points:[--drawer-overlay-min-opacity:0.5] calc:data-starting-style:opacity-0 calc:data-swiping:duration-0 calc:supports-backdrop-filter:backdrop-blur-sm calc:supports-[-webkit-touch-callout:none]:absolute',
        className
      )}
      {...props}
    />
  );
}

function DrawerSwipeHandle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-swipe-handle"
      aria-hidden="true"
      className={cn(
        'calc:relative calc:z-10 calc:flex calc:shrink-0 calc:cursor-grab calc:transition-opacity calc:duration-200 calc:group-data-nested-drawer-open/drawer-popup:opacity-0 calc:group-data-nested-drawer-swiping/drawer-popup:opacity-100 calc:group-data-[swipe-axis=x]/drawer-popup:h-full calc:group-data-[swipe-axis=x]/drawer-popup:w-3 calc:group-data-[swipe-axis=x]/drawer-popup:items-center calc:group-data-[swipe-axis=y]/drawer-popup:h-3 calc:group-data-[swipe-axis=y]/drawer-popup:w-full calc:group-data-[swipe-axis=y]/drawer-popup:justify-center calc:group-data-[swipe-direction=down]/drawer-popup:items-end calc:group-data-[swipe-direction=left]/drawer-popup:order-last calc:group-data-[swipe-direction=left]/drawer-popup:justify-start calc:group-data-[swipe-direction=right]/drawer-popup:justify-end calc:group-data-[swipe-direction=up]/drawer-popup:order-last calc:group-data-[swipe-direction=up]/drawer-popup:items-start calc:after:block calc:after:shrink-0 calc:after:rounded-full calc:after:bg-muted calc:group-data-[swipe-axis=x]/drawer-popup:after:h-[100px] calc:group-data-[swipe-axis=x]/drawer-popup:after:w-1.5 calc:group-data-[swipe-axis=y]/drawer-popup:after:h-1.5 calc:group-data-[swipe-axis=y]/drawer-popup:after:w-[100px] calc:active:cursor-grabbing',
        className
      )}
      {...props}
    />
  );
}

function DrawerContent({ className, children, ...props }: DrawerPrimitive.Popup.Props) {
  const { hasSnapPoints, modal, showSwipeHandle, swipeDirection } = useDrawer();
  const swipeAxis = swipeDirection === 'down' || swipeDirection === 'up' ? 'y' : 'x';

  return (
    <DrawerPortal data-slot="drawer-portal">
      {modal === true && (
        <DrawerOverlay data-snap-points={hasSnapPoints ? '' : undefined} />
      )}
      <DrawerPrimitive.Viewport
        data-slot="drawer-viewport"
        data-modal={modal}
        className="calc:pointer-events-none calc:fixed calc:inset-0 calc:z-50 calc:select-none calc:data-[modal=true]:pointer-events-auto"
      >
        <DrawerPrimitive.Popup
          data-slot="drawer-popup"
          data-swipe-axis={swipeAxis}
          data-snap-points={hasSnapPoints ? '' : undefined}
          className={cn(
            // Base.
            'calc:group/drawer-popup calc:pointer-events-auto calc:fixed calc:z-50 calc:m-(--drawer-inset,0px) calc:flex calc:h-(--drawer-content-height) calc:max-h-(--drawer-content-max-height,none) calc:min-h-0 calc:w-(--drawer-content-width,auto) calc:transform-[translate3d(var(--translate-x,0px),var(--translate-y,0px),0)_scale(var(--stack-scale))] calc:flex-col calc:rounded-4xl calc:border calc:border-popover calc:bg-popover calc:text-sm calc:text-popover-foreground calc:shadow-xl calc:transition-[transform,height,opacity,filter] calc:duration-450 calc:ease-[cubic-bezier(0.22,1,0.36,1)] calc:will-change-transform calc:outline-none calc:select-none calc:[--drawer-bleed-background:transparent] calc:[--drawer-inset:--spacing(2)] calc:[--drawer-stacked-shadow:0_-20px_25px_-5px_rgb(0_0_0/0.1),0_-8px_10px_-6px_rgb(0_0_0/0.1)] calc:[interpolate-size:allow-keywords] calc:data-[swipe-direction=down]:data-nested-drawer-open:shadow-(--drawer-stacked-shadow) calc:dark:border-border',
            // Nested.
            'calc:data-nested-drawer-open:overflow-hidden calc:data-nested-drawer-open:brightness-95',
            // Bleed.
            'calc:after:pointer-events-none calc:after:absolute calc:after:bg-(--drawer-bleed-background,var(--color-popover)) calc:data-[swipe-axis=x]:after:inset-y-0 calc:data-[swipe-axis=x]:after:w-(--bleed) calc:data-[swipe-axis=y]:after:inset-x-0 calc:data-[swipe-axis=y]:after:h-(--bleed) calc:data-[swipe-direction=down]:after:top-full calc:data-[swipe-direction=left]:after:right-full calc:data-[swipe-direction=right]:after:left-full calc:data-[swipe-direction=up]:after:bottom-full',
            // Sizing.
            'calc:[--drawer-content-height:var(--drawer-height,auto)] calc:data-[swipe-axis=x]:[--drawer-content-width:75%] calc:data-[swipe-axis=y]:[--drawer-content-max-height:calc(100dvh-6rem)] calc:data-[swipe-axis=y]:data-snap-points:[--drawer-content-height:100dvh] calc:data-[swipe-axis=x]:sm:[--drawer-content-width:24rem]',
            // Stack.
            'calc:[--bleed:3rem] calc:[--peek:1rem] calc:[--stack-height:var(--drawer-frontmost-height,var(--drawer-height,0px))] calc:[--stack-peek-offset:max(0px,calc((var(--nested-drawers)-var(--stack-progress))*var(--peek)))] calc:[--stack-progress:clamp(0,var(--drawer-swipe-progress),1)] calc:[--stack-scale-base:max(0,calc(1-(var(--nested-drawers)*var(--stack-step))))] calc:[--stack-scale:clamp(0,calc(var(--stack-scale-base)+(var(--stack-step)*var(--stack-progress))),1)] calc:[--stack-shrink:calc(1-var(--stack-scale))] calc:[--stack-step:0.05]',
            // Transitions.
            'calc:data-ending-style:transform-(--closed-transform) calc:data-ending-style:opacity-[0.9999] calc:data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] calc:data-nested-drawer-swiping:duration-0 calc:data-ending-style:data-nested-drawer-swiping:duration-[calc(var(--drawer-swipe-strength)*400ms)] calc:data-starting-style:transform-(--closed-transform) calc:data-swiping:duration-0 calc:data-ending-style:data-swiping:duration-[calc(var(--drawer-swipe-strength)*400ms)]',
            // Axis: y.
            'calc:data-[swipe-axis=y]:inset-x-0 calc:data-[swipe-axis=y]:data-nested-drawer-open:h-(--stack-height)',
            // Axis: x.
            'calc:data-[swipe-axis=x]:inset-y-0 calc:data-[swipe-axis=x]:flex-row',
            // Direction: down.
            'calc:data-[swipe-direction=down]:bottom-0 calc:data-[swipe-direction=down]:origin-bottom calc:data-[swipe-direction=down]:[--closed-transform:translate3d(0,calc(100%+var(--drawer-inset,0px)+2px),0)] calc:data-[swipe-direction=down]:[--translate-y:calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y)-var(--stack-peek-offset)-(var(--stack-shrink)*var(--stack-height)))]',
            // Direction: up.
            'calc:data-[swipe-direction=up]:top-0 calc:data-[swipe-direction=up]:origin-top calc:data-[swipe-direction=up]:[--closed-transform:translate3d(0,calc(-100%-var(--drawer-inset,0px)-2px),0)] calc:data-[swipe-direction=up]:[--translate-y:calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y)+var(--stack-peek-offset)+(var(--stack-shrink)*var(--stack-height)))]',
            // Direction: left.
            'calc:data-[swipe-direction=left]:left-0 calc:data-[swipe-direction=left]:origin-left calc:data-[swipe-direction=left]:[--closed-transform:translate3d(calc(-100%-var(--drawer-inset,0px)-2px),0,0)] calc:data-[swipe-direction=left]:[--translate-x:calc(var(--drawer-swipe-movement-x)+var(--stack-peek-offset)+(var(--stack-shrink)*100%))]',
            // Direction: right.
            'calc:data-[swipe-direction=right]:right-0 calc:data-[swipe-direction=right]:origin-right calc:data-[swipe-direction=right]:[--closed-transform:translate3d(calc(100%+var(--drawer-inset,0px)+2px),0,0)] calc:data-[swipe-direction=right]:[--translate-x:calc(var(--drawer-swipe-movement-x)-var(--stack-peek-offset)-(var(--stack-shrink)*100%))]',
            className
          )}
          {...props}
        >
          {showSwipeHandle && <DrawerSwipeHandle />}
          <DrawerPrimitive.Content
            data-slot="drawer-content"
            className={cn(
              'calc:flex calc:min-h-0 calc:flex-1 calc:flex-col calc:overflow-hidden calc:overscroll-contain calc:rounded-[inherit] calc:transition-opacity calc:duration-300 calc:ease-[cubic-bezier(0.45,1.005,0,1.005)] calc:select-text calc:group-data-nested-drawer-open/drawer-popup:opacity-0 calc:group-data-nested-drawer-swiping/drawer-popup:opacity-100 calc:group-data-swiping/drawer-popup:select-none'
            )}
          >
            {children}
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPortal>
  );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        'calc:flex calc:shrink-0 calc:flex-col calc:gap-0.5 calc:p-4 calc:pb-0 calc:group-data-[swipe-axis=y]/drawer-popup:text-center calc:md:gap-1.5 calc:md:text-left',
        className
      )}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn(
        'calc:mt-auto calc:flex calc:shrink-0 calc:flex-col calc:gap-2 calc:p-4 calc:pt-0',
        className
      )}
      {...props}
    />
  );
}

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn(
        'calc:font-heading calc:text-base calc:font-medium calc:text-foreground',
        className
      )}
      {...props}
    />
  );
}

function DrawerDescription({ className, ...props }: DrawerPrimitive.Description.Props) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn(
        'calc:text-sm calc:text-balance calc:text-muted-foreground',
        className
      )}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerSwipeHandle,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
