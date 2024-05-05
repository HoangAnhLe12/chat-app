import { Children } from "react";

const AuthLayour = ({children} : {children:React.ReactNode}) => {
    return ( 
        <div className=" h-full flex items-center justify-center">
            {children}
        </div>
     );
}
 
export default AuthLayour;