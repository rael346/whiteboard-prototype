import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { socket } from "@/lib/socket";
import { useRoomStore } from "@/stores/roomStore";
import { User, useUserStore } from "@/stores/userStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

export default function JoinRoomButton() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const setUser = useUserStore(state => state.setUser);
  const setMembers = useRoomStore(state => state.setMembers);
  const setAdmin = useRoomStore(state => state.setAdmin);

  const joinRoomSchema = z.object({
    name: z
      .string()
      .min(2, "Username must contain at least 2 characters")
      .max(50, "Username must not contain more than 50 characters"),
    roomId: z
      .string()
      .trim()
      .length(21, "Room ID must contain exactly 21 characters"),
  });
  type JoinRoomForm = z.infer<typeof joinRoomSchema>;

  const form = useForm<JoinRoomForm>({
    resolver: zodResolver(joinRoomSchema),
    defaultValues: {
      name: "",
      roomId: "",
    },
  });

  const onSubmit = ({ name, roomId }: JoinRoomForm) => {
    setIsLoading(true);
    socket.emit("join-room", { roomId, name });
  };

  type RoomJoinedData = {
    roomId: string;
    user: User;
    admin: User | undefined;
    members: User[];
  };

  useEffect(() => {
    socket.on(
      "room-joined",
      ({ user, roomId, admin, members }: RoomJoinedData) => {
        console.log("Room Joined", roomId, user, admin, members);
        setUser(user);
        setAdmin(admin);
        setMembers(members);
        navigate(`/${roomId}`);
      },
    );

    return () => {
      socket.off("room-joined");
    };
  }, [setUser, setAdmin, setMembers, navigate]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Join a Room
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[90vw] max-w-[400px]">
        <DialogHeader className="pb-2">
          <DialogTitle>Join a room now!</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Room ID" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-2">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Join"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
