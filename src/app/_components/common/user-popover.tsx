import { useFloating, useTransitionStyles, autoUpdate, offset, flip, shift, useClick, useDismiss, useRole, useInteractions , FloatingFocusManager} from "@floating-ui/react"
import { ReactNode, useState } from "react"

// Based from https://floating-ui.com/docs/popover
export function UserPopover({button, popover, autoposition = true} : {button : ReactNode, popover : ReactNode, autoposition?: boolean}) { 
    const [isOpen, setIsOpen] = useState(false);
 
    const autoPositionMiddleware = autoposition ? [flip(), shift()] : [];
    
    const {refs, floatingStyles, context} = useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
      placement: "bottom-end",
      middleware: [offset(8), ...autoPositionMiddleware],
      whileElementsMounted: autoUpdate,
    });

    const { styles: transitionStyles } = useTransitionStyles(context);

    const click = useClick(context);
    const dismiss = useDismiss(context);
    const role = useRole(context);
   
    // Merge all the interactions into prop getters
    const {getReferenceProps, getFloatingProps} = useInteractions([
      click,
      dismiss,
      role,
    ]);

    return (
        <>
        <button ref={refs.setReference} {...getReferenceProps()}>
           {button}
        </button>
        {isOpen && (
            <FloatingFocusManager context={context} modal={false}>
                <div ref={refs.setFloating} style={{...floatingStyles, zIndex: 999 /* set z-index because floating-ui doesn't */}} {...getFloatingProps()}>
                    <div style={transitionStyles}>
                        {popover}
                    </div>
                </div>
            </FloatingFocusManager>
        )}
        
        </>
    )
    }