import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {motion} from 'framer-motion';

import {cn} from '@/lib/utils';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay: React.FC<{
  className?: string;
  ref?: React.Ref<React.ComponentRef<typeof DialogPrimitive.Overlay>>;
}> = ({className, ref, ...props}) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80',
      className,
    )}
    {...props}
  />
);
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent: React.FC<{
  className?: string;
  children?: React.ReactNode;
  ref?: React.Ref<React.ComponentRef<typeof DialogPrimitive.Content>>;
}> = ({className, children, ref, ...props}) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content asChild {...props} ref={ref} forceMount>
      <motion.div
        initial={{opacity: 0, scale: 0.96, x: '-50%', y: '-40%'}}
        animate={{opacity: 1, scale: 1, x: '-50%', y: '-50%'}}
        exit={{opacity: 0, scale: 0.96, x: '-50%', y: '-40%'}}
        transition={{duration: 0.18, ease: 'easeInOut'}}
        className={cn(
          'bg-background fixed left-1/2 top-1/2 z-50 flex max-w-lg flex-col gap-4 border p-6 shadow-lg duration-200 sm:rounded-lg',
          className,
        )}
      >
        {children}
        <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-transparent opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none">
          <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </motion.div>
    </DialogPrimitive.Content>
  </DialogPortal>
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({className, ...props}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({className, ...props}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle: React.FC<{
  className?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLHeadingElement>;
}> = ({className, children, ref, ...props}) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  >
    {children}
  </DialogPrimitive.Title>
);
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription: React.FC<{
  className?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLParagraphElement>;
}> = ({className, children, ref, ...props}) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-muted-foreground text-sm', className)}
    {...props}
  >
    {children}
  </DialogPrimitive.Description>
);
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
