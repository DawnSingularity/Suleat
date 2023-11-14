"use client"

import { useFloating, useTransitionStyles, autoUpdate, offset, flip, shift, useClick, useDismiss, useRole, useInteractions , FloatingFocusManager, FloatingOverlay, FloatingPortal} from "@floating-ui/react"
import { useState } from "react"
import { ReactEventHandler, ReactNode } from "react";

// WIP modal
export function Modal({ open, onOpenChange, children, title = "", showCloseButton = true }: { open: boolean, onOpenChange: (x : boolean) => void, children : ReactNode, title? : string, showCloseButton? : boolean}) {
  const {refs, floatingStyles, context} = useFloating({ open, onOpenChange });
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
    <FloatingPortal>
      <FloatingOverlay
        lockScroll
        style={{background: 'rgba(0, 0, 0, 0.5)', zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center"}}
      >
        <FloatingFocusManager context={context}>
          <div
            ref={refs.setFloating}
            {...getFloatingProps()}
          >
            {/* Modal (Box) itself */}
            <div className="w-full max-w-fit max-h-fit pb-6 pl-6 pr-6 pt-2 m-5 bg-white rounded-lg shadow-lg" style={transitionStyles}>
              {/* Modal content */}
              <div className="relative">
                {/* Modal header */}
                <div className="flex items-start border-b rounded-t">
                  { showCloseButton && 
                    <button onClick={() => {onOpenChange(false)}} type="button" className="my-4 mr-1 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center" data-modal-hide="defaultModal">
                      <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button> }
                  <h3 className="p-4 text-xl font-semibold text-gray-900">{title}</h3> 
                  { /* <button onClick={saveProfile} type="button" className="text-white md:w-20 w-16 p-1 mt-4 mb-4 mr-2 ml-auto bg-[#fc571a] rounded-2xl">Save</button> */}
                </div>
                {/* Modal body */}
                <div className="m-auto">
                  {children}
                </div>
              </div>
            </div>
        </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  )

}
  
  