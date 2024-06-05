import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/types";
import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {

  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);
    const { directMessageFriendId, friendId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!friendId) {
      return res.status(400).json({ error: "Conversation ID missing" });
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
  
    let directMessage = await db.directMessageFriend.findFirst({
      where: {
        id: directMessageFriendId as string,
        friendId: friendId as string,
      }
    })

    if (!directMessage || directMessage.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isMessageOwner = directMessage.profileId === profile.id;
    const canModify = isMessageOwner;

    if (!canModify) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "DELETE") {
      directMessage = await db.directMessageFriend.update({
        where: {
          id: directMessageFriendId as string,
        },
        data: {
          fileUrl: null,
          content: "This message has been deleted.",
          deleted: true,
        },
      })
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      directMessage = await db.directMessageFriend.update({
        where: {
          id: directMessageFriendId as string,
        },
        data: {
          content,
        }
      })
    }

    const updateKey = `chat:${conversation.id}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, directMessage);

    return res.status(200).json(directMessage);
  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}