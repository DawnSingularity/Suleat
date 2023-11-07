import Color from "colorjs.io";
import {useState} from "react";

export function PillButton({ id="", text = "", backgroundColor = "", disabledBackgroundColor = "white", value=true, onChange, className = "" }:  {
    id?: string,
    text?: string,
    backgroundColor?: string,
    disabledBackgroundColor?: string
    value?: Boolean,
    onChange?: (key : string, val : Boolean) => void,
    className? : string
    }) { 
    
    const [hovering, setHovering] = useState(false)

    const onClick = (e : React.MouseEvent) => {
        e.preventDefault()
        if(onChange != null) {
            onChange(id, !value)
        }
    }

    let newBackgroundColor = "initial"
    let newColor = "initial"
    try {
        const color = new Color(value ? backgroundColor : disabledBackgroundColor)
        
        if(hovering) {
            // reduce brightness
            color.lch.l *= 0.9
        }

        newBackgroundColor = color.toString()

        // determine if black or white text using https://stackoverflow.com/a/3943023
        newColor = color.luminance > 0.179 ? "black" : "white"
    } catch (e : unknown) {
        console.log("Error parsing background color passed to button")
    }

    let style : React.CSSProperties = {backgroundColor: newBackgroundColor}
    // if custom color is not passed
    if(!className.match(/\bcolor-/)) {
        style.color = newColor
    }
    return (<button className={`my-1 mx-2 text-xs py-1 px-2 rounded-full h-full border ${className}`} 
        style={style} 
        onClick={onClick} 
        onMouseEnter={() => {setHovering(true)}}
        onMouseLeave={() => {setHovering(false)}}>{text}</button>)
}
