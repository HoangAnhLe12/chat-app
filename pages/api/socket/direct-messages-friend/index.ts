import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";
import { redirect } from "next/navigation";

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponseServerIo,
) {
    if (req.method !== "POST"){
        return res.status(405).json({error: "Method not allowed"});
    }

    try {
        const profile = await currentProfilePages(req);
        const { content, fileUrl} = req.body;
        const { friendId } = req.query;

        if ( !profile) {
            return res.status(401).json({error: "Unauthorized"});
        }

        if (!friendId){
            return res.status(400).json({error: "Conversation ID missing"});
        }

        if (!content){
            return res.status(400).json({error: "Content missing"});
        }

        const conversation = await db.friend.findFirst({
            where:{
                id: friendId as string,
                OR: [
                    {
                        profileId: profile.id
                    },
                    {
                        friendId: profile.id
                    }
                ]
            },
        })
        
        if ( !conversation ) {
            return res.status(404).json({error: "Conversation not found"});
        }

        const member = conversation.profileId === profile.id ? conversation.friendId : conversation.profileId;

        const otherFriend = await db.profile.findUnique({
            where:{
                id: member
            }
        })
        if(!otherFriend) {
            return redirect(`/user/${profile.id}`);
        }

        if(!member){
            return res.status(404).json({error: "Member not found"});
        }

        const message = await db.directMessageFriend.create({
            data:{
                content,
                fileUrl,
                friendId: friendId as string,
                profileId: otherFriend.id,
            },
        });

        const channelKey = `chat:${friendId}:messages`;

        res?.socket?.server?.io?.emit(channelKey, message);

        return res.status(200).json(message);

    } catch (error) {
        console.log("DIRECT_MESSAGE_POST", error);
        return res.status(500).json({message: "Internal Error"});
    }
}