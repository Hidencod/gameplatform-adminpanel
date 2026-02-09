interface ButtonProps
{
    children:React.ReactNode;
    type?:"button" | "submit"
    disabled?:boolean;
}
export default function Button({children, type="button", disabled=false}:ButtonProps)
{
    return(
        <button
        type={type}
        disabled={disabled}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        {children}
        </button>
    );
}