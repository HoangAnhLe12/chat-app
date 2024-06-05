
import { db } from "./db";

export const getFriend = async (profileId: string, friendId: string) => {
    let friend = await findFriend ( profileId, friendId) || await findFriend(friendId, profileId);

    return friend;
}

const findFriend = async ( profileId: string, friendId: string) => {
    try {
        return await db.friend.findFirst({
            where:{
                AND: [
                    {profileId: profileId},
                    {friendId: friendId},
                ]
            },
            include:{
                profile: true
            }
        });
    } catch (error) {
        return null;
    }    
};
