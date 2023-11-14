import { api } from "~/trpc/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { PillButton } from "./pill-button";
import { Flavor } from "@prisma/client";

// Set but with toArray function
class FlavorStates extends Set<string> {
    toArray = () => Array.from(this.values())
}

export function useFlavorStates({ initialValues } : { initialValues: Flavor[] | string[] }) {
    const initialValuesString : string[] = initialValues.map((val) => typeof val == "string" ? val /* string */ : val.name /* flavor */)

    const state = useState<FlavorStates>(new FlavorStates(initialValuesString))
    return state
}

export function FlavorProfileSelector({ flavors, flavorStates, setFlavorStates } : {  
    flavors : Flavor[],
    flavorStates : FlavorStates,
    setFlavorStates : Dispatch<SetStateAction<FlavorStates>>
}) {
    const changeFlavor = (flavor : string, val : Boolean) => {
        // important: it must be a function to prevent issues when >= 2 of the flavors are changed at the same time (only one of them will be changed)
        setFlavorStates((prevStates) => {
          // create copy
          const newStates = new FlavorStates(prevStates)
    
          // change value in copy
          if(val) {
            newStates.add(flavor)
          } else {
            newStates.delete(flavor)
          }
    
          return newStates
        })
      }

    return (
        <div className="flavors pl-2 ml-1" id="flavors">
            { flavors.map(({name, color}, i) => {
            return (<PillButton id={name} text={name} backgroundColor={color} value={flavorStates.has(name)} onChange={changeFlavor}/>);
            })}
        </div>  
    )
}
