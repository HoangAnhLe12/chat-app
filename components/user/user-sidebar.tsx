import { UserHeader } from "@/components/user/user-header"
import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserFriend } from "./user-friend";
import { db } from "@/lib/db";
import { UserSearch } from "./user-search";
import { Separator } from "@/components/ui/separator";

interface UserSidebarProps {
    id: string;
}

export const UserSidebar = async ({
    id
}:UserSidebarProps) => {

    const profile = await currentProfile();

    
    if(!profile) {
        return redirect("/");
    }

    const initialProfile = profile.id;

    const friends = await db.friend.findMany({
        where: {
          OR: [
            { profileId: profile.id },
            { friendId: profile.id }
          ]
        }
    });

    const friendIds = friends.map(friend => 
        friend.profileId === profile.id ? friend.friendId : friend.profileId
    );

    const friendProfiles = await db.profile.findMany({
        where: {
          id: { in: friendIds }
        }
      });      
      
    return (  
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
             <UserHeader 
                profile={profile}
            />
        <ScrollArea>       
        <div className="mt-2">
                    <UserSearch
                    data={[
                        {
                            label: "friend",
                            type: "member",
                            data: friendProfiles?.map((profile) => ({
                                id: profile.id,
                                name: profile.name,
                                src: profile.imageUrl
                            }))
                        }
                    ]}
                    />
                </div>
                <Separator 
                className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2"
                />
                {!friendProfiles.length && (
                    <div className="space-y-[2px] items-center">                
                        <p
                        className=" px-[20px] pt-[20px] pb-[20px] text-xs font-semibold text-zinc-500 dark:text-zinc-400"
                        >You dont have any friends</p>
                        <p
                        className=" px-[20px] text-xs font-semibold text-zinc-500 dark:text-zinc-400"
                        >Lets make friends to chat</p>
                    </div>
                )}
                {!!friendProfiles.length && (
                    <div className="space-y-[2px]">                
                        {friendProfiles.map((profile) => (
                            <UserFriend
                                key={profile.id}
                                profile={profile}
                                id={initialProfile} 
                           />
                        ))}
                    </div>
                )}   

        </ScrollArea>
        
        </div>   
        
       
    )
}
    