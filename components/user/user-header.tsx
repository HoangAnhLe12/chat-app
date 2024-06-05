"use client";

import { 
    ChevronDown, 
    UserPlus, 
} from "lucide-react";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-model-store";
import { Profile } from "@prisma/client";

interface UserHeaderProps {
    profile: Profile
};

export const UserHeader = ({
    profile
}:UserHeaderProps) =>{

    const { onOpen} = useModal();

    return (
        
        <DropdownMenu>
            <DropdownMenuTrigger
            className="focus:outline-none transition ease-in-out delay-150"
            asChild
            >
                <button
                className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200
                dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10
                dark:hover:bg-zinc-700/50 transition"
                >
                    Your Friends
                    <ChevronDown
                    className="h-5 w-5 ml-auto max-[768px]:hidden "
                    />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
            className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]"
            >
                <DropdownMenuItem
                    onClick={() => onOpen("inviteFriend", {profile} )}
                    className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
                    >
                        Add Friend
                        <UserPlus
                        className="h-4 w-4 ml-auto"
                        />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        
    )
}