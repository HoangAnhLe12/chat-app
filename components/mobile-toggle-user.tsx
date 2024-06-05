import { Menu } from "lucide-react"

import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from"@/components/ui/button";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { UserSidebar } from "@/components/user/user-sidebar";

export const MobileToggleUser = ({
    id,
}: {
    id: string;
}) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu/>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 flex gap-0">
                <div className="w-[72px]">
                    <NavigationSidebar/>
                </div>
                <UserSidebar id= {id}/>
            </SheetContent>
        </Sheet>
    )
}