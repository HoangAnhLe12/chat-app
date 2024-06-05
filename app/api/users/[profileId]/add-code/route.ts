import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server"

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH (
    req: Request,
    {params }: { params: { profileId: string}}
){
    try {
        const profile = await currentProfile();

        if (!profile){
            return new NextResponse("Unauthorized",{status: 401})
        }

        const user = await db.profile.update({
            where:{
                id: params.profileId,
            },
            data: {
                addCode: uuidv4(),
            },
        });

        return NextResponse.json(user);
        
    } catch (error) {
        console.log("[SERVER_ID", error);
        return new NextResponse("internal Error", {status: 500});
    }
}