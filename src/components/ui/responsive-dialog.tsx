"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";

const ResponsiveDialog = ({
  children,
  ...props
}: React.ComponentProps<typeof Dialog>) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <Dialog {...props}>{children}</Dialog>;
  }
  return <Drawer {...props}>{children}</Drawer>;
};

const ResponsiveDialogTrigger = ({
  children,
  ...props
}: React.ComponentProps<typeof DialogTrigger>) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <DialogTrigger {...props}>{children}</DialogTrigger>;
  }
  return <DrawerTrigger {...props}>{children}</DrawerTrigger>;
};

// --- ResponsiveDialog.Content ---
interface ResponsiveDialogContentProps
  extends React.ComponentProps<typeof DialogContent> {
  children: React.ReactNode;
  /** Additional class name for the desktop dialog content. */
  dialogClassName?: string;
  /** Additional class name for the mobile drawer content. */
  drawerClassName?: string;
}

// DialogContent and DrawerContent require forwardRef for portals/overlay interactions
const ResponsiveDialogContent = ({
  children,
  dialogClassName,
  drawerClassName,
  ...props
}: ResponsiveDialogContentProps) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <DialogContent className={cn(dialogClassName)} {...props}>
        {children}
      </DialogContent>
    );
  }

  return (
    <DrawerContent className={drawerClassName} {...props}>
      {children}
    </DrawerContent>
  );
};

const ResponsiveDialogHeader = ({
  className,
  ...props
}: React.ComponentProps<typeof DialogHeader>) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <DialogHeader className={className} {...props} />;
  }
  return <DrawerHeader className={className} {...props} />;
};

const ResponsiveDialogTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof DialogTitle>) => {
  const isMobile = useIsMobile();
  if (!isMobile) {
    return <DialogTitle className={className} {...props} />;
  }
  return <DrawerTitle className={className} {...props} />;
};

const ResponsiveDialogDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof DialogDescription>) => {
  const isMobile = useIsMobile();
  if (!isMobile) {
    return <DialogDescription className={className} {...props} />;
  }
  return <DrawerDescription className={className} {...props} />;
};

const ResponsiveDialogBody = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const isMobile = useIsMobile();
  if (!isMobile) {
    // Dialog content usually has padding from DialogContent itself, so no extra padding here
    return <div className={cn(className)} {...props} />;
  }
  // Drawer content needs explicit padding for its children
  return <div className={cn("overflow-y-auto p-4", className)} {...props} />;
};

// --- ResponsiveDialog.Footer ---
interface ResponsiveDialogFooterProps
  extends React.ComponentProps<typeof DialogFooter> {
  showDefaultDrawerCloseButton?: boolean;
  showDialogFooter?: boolean;
  drawerCloseButtonText?: string;
}

const ResponsiveDialogFooter = ({
  className,
  children,
  showDefaultDrawerCloseButton = false,
  drawerCloseButtonText = "Cancel",
  showDialogFooter = false,
  ...props
}: ResponsiveDialogFooterProps) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      showDialogFooter && (
        <DialogFooter className={className} {...props}>
          {children}
        </DialogFooter>
      )
    );
  }

  return (
    <DrawerFooter className={cn("pt-0",className)} {...props}>
      {children}
      {showDefaultDrawerCloseButton && (
        <DrawerClose asChild>
          <Button variant="outline">{drawerCloseButtonText}</Button>
        </DrawerClose>
      )}
    </DrawerFooter>
  );
};

const ResponsiveDialogClose = ({
  children,
  ...props
}: React.ComponentProps<typeof DialogClose>) => {
  const isMobile = useIsMobile();
  if (!isMobile) {
    return <DialogClose {...props}>{children}</DialogClose>;
  }
  return <DrawerClose {...props}>{children}</DrawerClose>;
};

// --- Assemble the ResponsiveDialog export ---
export {
  ResponsiveDialog,
  ResponsiveDialogTrigger,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
  ResponsiveDialogBody,
  ResponsiveDialogFooter,
  ResponsiveDialogClose,
};
