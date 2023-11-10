import { useFloating, useTransitionStyles, autoUpdate, offset, flip, shift, useClick, useDismiss, useRole, useInteractions , FloatingFocusManager} from "@floating-ui/react"
import { ReactNode, useState } from "react"

// Based from https://floating-ui.com/docs/popover
export function UserPopover({button, popover} : {button : ReactNode, popover : ReactNode}) { 
    const [isOpen, setIsOpen] = useState(false);
 
    const {refs, floatingStyles, context} = useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
      middleware: [offset(8), flip(), shift()],
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
                <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
                    <div style={transitionStyles}>
                        {popover}
                    </div>
                </div>
            </FloatingFocusManager>
        )}
        
        </>
    )
    }