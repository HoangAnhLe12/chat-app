import { ChatFriend } from "@/components/chat/chat-friends";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatHeaderUser } from "@/components/chat/chat-user";
import { MediaRoom } from "@/components/media-room";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { getFriend } from "@/lib/friends";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
    params: {
        profileId: string;
    },
    searchParams:{
        video?: boolean;
    }
}

const MemberIdPage = async ({
    params,
    searchParams,
}:MemberIdPageProps) =>  {

    const profile = await currentProfile();

    if(!profile) {
        return auth().redirectToSignIn();
    }

    const initialProfile = await db.profile.findFirst({
        where:{
            id: profile.id
        }
    })
    
    if (!initialProfile){
        return redirect(`/user/${profile.id}`);
    }
    const friend = await getFriend(profile.id, params.profileId);
    // Trả về 2 th là profileId = profile.id và friendId = params.profileId ||
    //profileId = params.profileId và friendId = profile.id
    if (!friend){
        return redirect(`/user/${profile.id}`);
    }

    const { profileId, friendId } = friend;
    const otherMember = friend.profileId === profile.id ? friendId : profileId
    // let otherMember;
    // if(friend.profileId === profile.id) {
    //     otherMember= friend.friendId
    // } else {
    //     otherMember = friend.profileId
    // }

    const otherFriend = await db.profile.findUnique({
        where:{
            id: otherMember
        }
    })
    if(!otherFriend) {
        return redirect(`/user/${profile.id}`);
    }

    return ( 
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeaderUser 
            imageUrl={otherFriend.imageUrl}
            name={otherFriend.name} 
            />
            {searchParams.video && (
                <MediaRoom
                chatId={friend.id}
                video={true}
                audio={true}
                />
            )}
            {!searchParams.video && (
                <>
                    <ChatFriend 
                    name={otherFriend.name} 
                    profile={initialProfile}
                    chatId={friend.id} 
                    apiUrl="/api/direct-messages-friend"
                    socketUrl="/api/socket/direct-messages-friend" 
                    socketQuery={{
                        friendId: friend.id,
                    }} 
                    paramKey={"friendId"}
                    paramValue={friend.id} 
                    type={"conversation"}            
                    />
                    <ChatInput 
                    name={otherFriend.name} 
                    type="conversation"
                    apiUrl="/api/socket/direct-messages-friend" 
                    query={{
                        friendId: friend.id,
                    }} 
                    />
                </>
            )}            
        </div>
     );
}
 
export default MemberIdPage;