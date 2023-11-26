import Color from "colorjs.io";
import {useState} from "react";

export function PillButton({ id="", text = "", backgroundColor = "", disabledBackgroundColor = "linear-gradient(white, white)", value=true, onChange, className = "" }:  {
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
    let border = "initial"
    try {
        // const color = new Color(value ? backgroundColor : disabledBackgroundColor)
        const color = value ? backgroundColor : disabledBackgroundColor
        
        // if(hovering) {
        //     // reduce brightness
        //     color.lch.l *= 0.9
        // }

        newBackgroundColor = color.toString()
        border = value ? "none" : "solid 1px #d1d1d1"

        // determine text color using APCA contrast
        // newColor = Math.abs(Color.contrastAPCA(color, "#000000")) > Math.abs(Color.contrastAPCA(color, "#FFFFFF")) ? "#000000" : "#FFFFFF"
        newColor = value ? "white" : "black"

    } catch (e : unknown) {
        console.log("Error parsing background color passed to button")
    }

    // let style : React.CSSProperties = {backgroundColor: newBackgroundColor}
    let style : React.CSSProperties = {backgroundImage: newBackgroundColor}
    // if custom color is not passed
    if(!className.match(/\bcolor-/)) {
        style.color = newColor
    }
    style.border = border;
    return (
        <span className={`my-1 mr-4 text-xs py-1.5 px-3 rounded-full drop-shadow-md h-full ${className}`} 
            style={style} 
            onClick={onClick}>{text}
        </span>
    )
}
