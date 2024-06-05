import { Server as NetServer, Socket} from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer} from "socket.io";
import { Profile, Member, Server, Friend } from "@prisma/client"

export type ServerWithMembersWithProfiles = Server & {
    members: (Member & { profile: Profile})[];
};

export type ProfileWithFriends = Profile & {
    friends: (Friend & { friend: Profile })[];
    friendOf: (Friend & { profile: Profile })[];
};

export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIOServer;
        };
    };
};