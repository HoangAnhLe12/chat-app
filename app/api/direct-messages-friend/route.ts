import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { DirectMessageFriend } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGES_BATCH = 10;

export async function GET(
    req: Request
) {
    try {
        const profile = await currentProfile();
        const {searchParams} = new URL(req.url);

        const cursor = searchParams.get("cursor");
        const friendId = searchParams.get("friendId");

        if(!profile) {
            return new NextResponse("Unauthorized", {status:401});
        }

        
        if(!friendId) {
            return new NextResponse("Conversation ID missing", {status:400});
        }

        let messages: DirectMessageFriend[] = [];

        if(cursor) {
            messages = await db.directMessageFriend.findMany({
                take: MESSAGES_BATCH,
                skip: 1,
                cursor:{
                    id: cursor,
                },
                where:{
                    friendId,
                },
                include:{
                    profile: true
                },
                orderBy:{
                    createdAt: "desc",
                }
            })
        } else {
            messages = await db.directMessageFriend.findMany({
                take: MESSAGES_BATCH,
                where: {
                    friendId,
                },
                include:{
                    profile: true
                },
                orderBy:{
                    createdAt:"desc",
                }
            });
        }

        let nextCursor = null;

        if (messages.length === MESSAGES_BATCH) {
            nextCursor = messages[MESSAGES_BATCH - 1].id;
        }

        return NextResponse.json({
            items: messages,
            nextCursor
        });

    } catch (error) {
        console.log("DIRECT_MESSAGES_GET", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}