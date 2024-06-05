import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface AddCodePageProps {
    params: {
        addCode: string;
    };
};

const InviteCodepage = async ({
    params
}:AddCodePageProps) => {

    const profile = await currentProfile();

    if (!profile) {
        return auth().redirectToSignIn();
    }

    if(!params.addCode){
        return redirect("/");
    }

    const existingUser = await db.profile.findFirst({
        where:{
            addCode: params.addCode,
        }
    });

    if (!existingUser){
        return redirect(`/user/${profile.id}`)
    }

    // Kiểm tra nếu mối quan hệ bạn bè đã tồn tại ở cả hai chiều
    const existingFriendship = await db.friend.findFirst({
        where: {
            OR: [
                {
                    profileId: existingUser.id,
                    friendId: profile.id,
                },
                {
                    profileId: profile.id,
                    friendId: existingUser.id,
                }
            ]
        }
    });

    if (existingFriendship) {
        return redirect(`/user/${profile.id}`);
    }

    // Nếu không có mối quan hệ trùng lặp, tạo mối quan hệ bạn bè mới
    const friend = await db.friend.create({
        data: {
            profileId: existingUser.id,
            friendId: profile.id,
        },
        
    });

    if (friend) {
        return redirect(`/user/${profile.id}`);
            
    }
}
 
export default InviteCodepage;