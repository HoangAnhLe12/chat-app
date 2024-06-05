import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    {params} : { params: {profileId: string}}
    
) {
    try {
        const profile = await currentProfile();

        if (!profile){
            return new NextResponse("Unauthorized",{status: 401});
        }

        if (!params.profileId) {
            return new NextResponse("Friend ID missing",{status: 400});
        }

        const friend = await db.friend.deleteMany({
           where: {
            OR: [
                { 
                    profileId: profile.id,
                    friendId: params.profileId
                },
                { 
                    profileId: params.profileId,
                    friendId: profile.id 
                },
              ],
           }
        });

        return NextResponse.json(friend);

    } catch (error) {
        console.log("FRIEND_ID_DELETE", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}
