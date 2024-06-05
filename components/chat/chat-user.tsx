import { Hash } from "lucide-react";
import { MobileToggleUser } from "@/components/mobile-toggle-user";
import { UserAvatar } from "@/components/user-avatar";
import { SocketIndicator } from "@/components/socket-indicator";
import { ChatVideoButton } from "./chat-video-button";

interface ChatHeaderProps {
    name: string;
    imageUrl?: string;
    id: string;
}

export const ChatHeaderUser = ({
    name,
    imageUrl,
    id,
}:ChatHeaderProps) => {
    return (
        <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200
        dark:border-neutral-800 border-b-2"
        >
            <MobileToggleUser id ={id}/>
                <UserAvatar
                src={imageUrl}
                className="h-8 w-6 md:h-8 md:w-8 mr-2"
                />
            <p className="font-semibold text-md text-black dark:text-white">
                {name}
            </p>
            <div className="ml-auto flex items-center">
                    <ChatVideoButton/>
                <SocketIndicator />
            </div>
        </div>
    )
}