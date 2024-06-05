import { auth} from "@clerk/nextjs/server";

import { currentProfile } from "@/lib/current-profile";
import { UserSidebar } from "@/components/user/user-sidebar";

const UserIdLayout = async ({
    children,
    params,
}:{
    children: React.ReactNode;
    params: {userId: string};
}) => {

    const profile = await currentProfile();

    if(!profile) {
        return auth().redirectToSignIn();
    }

    return (
        <div className="h-full">
            <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
                <UserSidebar
                id={params.userId}
                />
            </div>
            <main className="h-full md:pl-60">
                {children}
            </main>
        </div>
    );
}

export default UserIdLayout;