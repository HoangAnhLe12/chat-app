import Image from "next/image";
import React from 'react';
import logo from "@/public/png-clipart-anime-science-fiction-darling-in-the-franxx-render-cg-artwork-black-hair-thumbnail-Photoroom.png"
import mountains from "@/public/mountains.jpg"
const UserIdPage = () => {
    return ( 
        <div className="relative w-[100%] h-[100%]">
            <div
            className="flex items-center h-12 border-neutral-200
        dark:border-neutral-800 border-b-2 justify-center text-xl font-bold"
        >  
        <span> Welcome to my groups project</span>
        </div>
        <Image
        alt="Mountains"
        src={mountains}
        placeholder="blur"
        quality={100}
        className="rounded-[10px]"
        sizes="100vw"
        style={{
            objectFit: 'cover'
        }}
        />
        <Image 
        className="bg-cover absolute bottom-0 right-0"
        src={logo} 
        alt={"logo"}
        />
        </div>        
     );
}
 
export default UserIdPage;