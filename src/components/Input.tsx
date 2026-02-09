interface InputProps
{
    type?:string;
    placeholder?:string;
    value:string;
    onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void;
    required?:boolean;
}
export default function Input(
    {
        type="text",
        placeholder="",
        value,
        onChange,
        required
    }:InputProps)
{
    return(
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} required={required}
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring" />
    )
    
}