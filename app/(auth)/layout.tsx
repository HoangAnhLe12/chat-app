import { Children } from "react";

const AuthLayour = ({children} : {children:React.ReactNode}) => {
    return ( 
        <div className="bg-red-500 h-full">
            {children}
        </div>
     );
}
 
export default AuthLayour;