import Color from "colorjs.io";
import {useState} from "react";

export function PillButton({ id="", text = "", backgroundColor = "", value=true, onChange }:  {
    id?: string,
    text?: string,
    backgroundColor?: string,
    value?: Boolean,
    onChange?: (key : string, val : Boolean) => void
    }) { 
    
    const [hovering, setHovering] = useState(false)

    const onClick = (e : React.MouseEvent) => {
        e.preventDefault()
        if(onChange != null) {
            onChange(id, !value)
        }
    }

    let newBackgroundColor = "initial"
    try {
        const color = new Color(backgroundColor)
        color.alpha = value ? 1 : 0
        
        if(hovering) {
            // reduce brightness
            color.lch.l *= 0.8
        }

        newBackgroundColor = color.toString()
    } catch (e : unknown) {
        console.log("Error parsing background color passed to button")
    }


    return (<button className={`my-1 mx-2 text-xs ${value ? "dark:text-white" : "dark:text-black"} py-1 px-2 rounded-full h-full border`} 
        style={{backgroundColor: newBackgroundColor}} 
        onClick={onClick} 
        onMouseEnter={() => {setHovering(true)}}
        onMouseLeave={() => {setHovering(false)}}>{text}</button>)
}
