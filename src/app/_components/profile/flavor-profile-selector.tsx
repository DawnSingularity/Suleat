import { api } from "~/trpc/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { PillButton } from "./pill-button";
import { Flavor } from "@prisma/client";

// Set but with toArray function
export class FlavorStates extends Set<string> {
    toArray = () => Array.from(this.values())
}

export function useFlavorStates(params? : { initialValues: Flavor[] | string[] | undefined }) {
    let initialValuesString : string[] | undefined = undefined

    if(params?.initialValues != null) {
        initialValuesString = params.initialValues.map((val) => typeof val == "string" ? val /* string */ : val.name /* flavor */)
    }

    const state = useState<FlavorStates>(new FlavorStates(initialValuesString))
    return state
}

export function FlavorProfileSelector({ flavors, flavorStates, setFlavorStates, className } : {  
    flavors? : Flavor[],
    flavorStates : FlavorStates,
    setFlavorStates : Dispatch<SetStateAction<FlavorStates>>,
    className? : string,
}) {
    const wholeListOfFlavorsQuery = api.flavor.getFlavors.useQuery(undefined /* no params */, {enabled: flavors == null})

    // if no flavors list passed
    if(flavors == null) {
        flavors= wholeListOfFlavorsQuery.data ?? []
    }
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
        <div className={"flavors " + className} id="flavors">
            { flavors.map(({name, color}, i) => {
            return (<PillButton id={name} text={name} className="cursor-pointer" backgroundColor={color} value={flavorStates.has(name)} onChange={changeFlavor}/>);
            })}
        </div>  
    )
}
