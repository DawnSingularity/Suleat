import rgba from "color-rgba";

export function PillButton({ id="", text = "", backgroundColor = "", color = "", value=false, onChange }:  {
    id: string,
    text: string,
    backgroundColor: string,
    color: string,
    value: Boolean,
    onChange: (key : string, val : Boolean) => void
    }) { 
    const onClick = (e : React.MouseEvent) => {
        e.preventDefault()
        if(onChange != null) {
            onChange(id, !value)
        }
    }

    const backgroundRGBA = rgba(backgroundColor)

    if(backgroundRGBA != null) {
        backgroundRGBA[3] = value ? 1 : 0
    }
    

    const style : React.CSSProperties = { backgroundColor: `rgba(${backgroundRGBA?.join()})`, color }
    return (<button className={"px-4 py-1 border rounded-full "} style={style} onClick={onClick}>{text}</button>)
}
