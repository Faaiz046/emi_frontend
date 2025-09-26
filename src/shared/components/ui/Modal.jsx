import React, { useEffect, useRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../../lib/utils";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "./Button";

const modalVariants = cva(
  "fixed inset-0 z-50 flex items-center justify-center !mt-0 !mb-0",
  {
    variants: {
      variant: {
        default: "bg-black/60 backdrop-blur-sm",
        blur: "bg-black/40 backdrop-blur-md",
        none: "bg-transparent",
      },
      size: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
        xl: "p-10",
        xxl: "p-10",
        full: "p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const modalContentVariants = cva(
  "relative bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden border border-gray-100 flex flex-col",
  {
    variants: {
      size: {
        sm: "max-w-sm w-full",
        default: "max-w-md w-full",
        lg: "max-w-lg w-full",
        xl: "max-w-4xl w-full",
        xxl: "max-w-[70%] w-full",
        full: "w-full h-full rounded-none",
      },
      animation: {
        fade: "animate-in fade-in duration-300 ease-out",
        slide: "animate-in slide-in-from-bottom-4 duration-300 ease-out",
        scale: "animate-in zoom-in-95 duration-300 ease-out",
        none: "",
      },
    },
    defaultVariants: {
      size: "default",
      animation: "scale",
    },
  }
);

const Modal = React.forwardRef(
  (
    {
      className,
      variant,
      size,
      animation,
      isOpen,
      onClose,
      children,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      showCloseButton = true,
      showHeader = true,
      showFooter = true,
      showCustomFooter = false,
      title,
      footerContent,
      loading = false,
      onSubmit,
      ...props
    },
    ref
  ) => {
    const modalRef = useRef(null);

    useEffect(() => {
      const handleEscape = (e) => {
        if (e.key === "Escape" && closeOnEscape) {
          onClose?.();
        }
      };

      if (isOpen) {
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";
      }

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }, [isOpen, closeOnEscape, onClose]);

    const handleOverlayClick = (e) => {
      if (e.target === e.currentTarget && closeOnOverlayClick) {
        onClose?.();
      }
    };

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className={modalVariants({
          variant,
          size,
          className,
        })}
        onClick={handleOverlayClick}
        {...props}
      >
        <div
          ref={modalRef}
          className={modalContentVariants({
            size,
            animation,
          })}
        >
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200 hover:scale-110"
              aria-label="Close modal"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}

          {showHeader && (
            <ModalHeader>
              {title && <ModalTitle>{title}</ModalTitle>}
            </ModalHeader>
          )}

          <ModalContent>{children}</ModalContent>

          {showCustomFooter && <ModalFooter>{footerContent}</ModalFooter>}
          {showFooter && !showCustomFooter && (
            <ModalFooter>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onClose?.()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  onClick={onSubmit}
                  loading={loading}
                >
                  {"Submit"}
                </Button>
              </div>
            </ModalFooter>
          )}
        </div>
      </div>
    );
  }
);

const ModalHeader = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between p-8 pb-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex-shrink-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

const ModalTitle = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn(
        "text-xl font-bold text-gray-900 tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
);

const ModalContent = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-8 overflow-y-auto flex-1", className)}
      {...props}
    >
      {children}
    </div>
  )
);

const ModalFooter = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-end gap-3 p-8 pt-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white flex-shrink-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

Modal.displayName = "Modal";
ModalHeader.displayName = "ModalHeader";
ModalTitle.displayName = "ModalTitle";
ModalContent.displayName = "ModalContent";
ModalFooter.displayName = "ModalFooter";

export {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalContent,
  ModalFooter,
  modalVariants,
  modalContentVariants,
};
