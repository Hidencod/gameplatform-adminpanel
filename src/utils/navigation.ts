let navigateFn:(path:string) =>void;
export const setNavigator = (navigate:(path:string)=>void) =>{
    navigateFn = navigate;
}
export const navigateTo = (path:string) =>
{
    if(navigateFn)
    {
        navigateFn(path);
    }else{
        window.location.href = path;
    }
}