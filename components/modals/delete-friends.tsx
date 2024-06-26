"use client";

import { useState } from "react";
import { useModal } from "@/hooks/use-model-store";
import qs from "query-string";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle

} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const DeleteFriendModal = () => {

    const { isOpen, onClose, type, data} = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === "deleteFriend";
    const { friend, profile } = data;

    const [ isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true)

            const url = qs.stringifyUrl({
                url: `/api/friends/${profile?.id}`,
                query: {
                    profileId: profile?.id,
                }
            })
            console.log(profile?.id)
            await axios.delete(url);
            onClose();
            //router.refresh();
            router.push(`/user/${profile?.id}`);
            router.refresh();
            
        } catch (error) {
            console.log(error);
        }finally{
            setIsLoading(false);
        }
    }
    

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 
            overflow-hidden ">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Friend
                    </DialogTitle>
                    <DialogDescription
                    className="text-center text-zinc-500"
                    >
                        Are you sure you want to remove <span
                        className="font-semibold text-rose-500"
                        > {profile?.name}</span> from your friends list ?
                        Will be permanently deleted.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                        disabled={isLoading}
                        onClick={onClose}
                        variant="ghost"
                        >
                            Cancel
                        </Button>
                        <Button
                        disabled={isLoading}
                        variant="primary"
                        onClick={onClick}
                        >
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
};