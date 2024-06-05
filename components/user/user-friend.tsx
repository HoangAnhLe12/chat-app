"use client";

import { cn } from "@/lib/utils";
import { Profile } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { UserAvatar } from "@/components/user-avatar";
import { ActionTooltip } from "../action-tooltip";
import { Trash } from "lucide-react";
import { ModalType, useModal } from "@/hooks/use-model-store";

interface UserFriendProps {
    profile: Profile;
    id: string;
}

export const UserFriend = ({
    profile,
    id
}:UserFriendProps) =>{

    const { onOpen } = useModal()
    const params = useParams();
    const router = useRouter();


    const onClick = () => {
        router.push(`/user/${id}/conversations/${profile.id}`);
    }
    const onAction = (e: React.MouseEvent, action : ModalType) =>{
        e.stopPropagation();
        onOpen(action, {profile});
    }

    return (
        <button
        onClick={onClick}
        className={cn(
            "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
            params?.profileId === profile.id && " bg-zinc-700/20 dark:bg-zinc-700"
        )}
        >
            <UserAvatar
            src={profile.imageUrl}
            className="h-8 w-8 md:h-8 md:w-8"
            />
            <p
            className={cn(
                "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                params?.profileId === profile.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
            )}
            >
                {profile.name}
            </p>
            <div className="ml-auto flex items-center gap-z-2">
                    <ActionTooltip
                    label="Delete"
                    >
                        <Trash
                        onClick={(e) => onAction(e, "deleteFriend")}
                        className="hidden group-hover:block w-4 h-4 text-zinc-500
                        hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"/>
                    </ActionTooltip>
                </div>
        </button>
    )
}