import { api } from "~/trpc/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { PillButton } from "./pill-button";
import { Flavor } from "@prisma/client";

type FlavorStates = Record<string, boolean>

export function getFlavorListFromStates(flavorStates : FlavorStates) {
    const flavorData = []
    for(let name of Object.keys(flavorStates)) {
      if(flavorStates[name]) {
        flavorData.push(name)
      }
    }
    return flavorData
}

export function useFlavorStates({ initialValues } : { initialValues: Flavor[] | string[] }) {
    const wholeListOfFlavors = api.flavor.getFlavors.useQuery().data ?? []

    const state = useState<FlavorStates>({})
    const[ flavorStates, setFlavorStates ] = state

    // set values once we have the list
    useEffect(() => {
        // converts ['sweet', 'sour'] to {sweet: true, sour: true, bitter: false, ...}
        setFlavorStates(wholeListOfFlavors.reduce((obj : Record<string, boolean>, flavorProfile : Flavor) => {
            obj[flavorProfile.name] = initialValues.some((item) => typeof item == "string" ? item : item.name === flavorProfile.name)
            return obj
            }
        , {}))
    }, [wholeListOfFlavors])

    return state
}

export function FlavorProfileSelector({ flavorStates, setFlavorStates } : {  
    flavorStates : FlavorStates,
    setFlavorStates : Dispatch<SetStateAction<FlavorStates>>
}) {
    const wholeListOfFlavors = api.flavor.getFlavors.useQuery().data ?? []

    const changeFlavor = (flavor : string, val : Boolean) => {
        // important: it must be a function to prevent issues when >= 2 of the flavors are changed at the same time (only one of them will be changed)
        setFlavorStates((prevStates) => {
          // create copy
          const newStates = {...prevStates}
    
          // change value in copy
          newStates[flavor] = val as boolean
    
          return newStates
        })
      }

    return (
        <div className="flavors pl-2 ml-1" id="flavors">
            { wholeListOfFlavors.map(({name, color}, i) => {
            return (<PillButton id={name} text={name} backgroundColor={color} value={flavorStates[name] ?? false} onChange={changeFlavor}/>);
            })}
        </div>  
    )
}
