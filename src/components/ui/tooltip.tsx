import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import {cn} from '@/lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent: React.FC<{
  className?: string;
  sideOffset?: number;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  ref?: React.Ref<React.ComponentRef<typeof TooltipPrimitive.Content>>;
  children?: React.ReactNode;
}> = ({className, sideOffset = 4, side, align, ref, children, ...props}) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    side={side}
    align={align}
    className={cn(
      'bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 origin-[--radix-tooltip-content-transform-origin] overflow-hidden rounded-md border px-3 py-1.5 text-sm shadow-md',
      className,
    )}
    {...props}
  >
    {children}
  </TooltipPrimitive.Content>
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger};
