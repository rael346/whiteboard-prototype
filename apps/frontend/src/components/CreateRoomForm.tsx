import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CopyButton from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { socket } from "@/lib/socket";
import { User, useUserStore } from "@/stores/userStore";
import { useRoomStore } from "@/stores/roomStore";
import { useNavigate } from "react-router-dom";

export default function CreateRoomForm({ roomId }: { roomId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const setUser = useUserStore(state => state.setUser);
  const setMembers = useRoomStore(state => state.setMembers);
  const setAdmin = useRoomStore(state => state.setAdmin);

  const createRoomSchema = z.object({
    username: z
      .string()
      .min(2, "Username must contain at least 2 characters")
      .max(50, "Username must not contain more than 50 characters"),
  });

  type CreatRoomForm = z.infer<typeof createRoomSchema>;

  const form = useForm<CreatRoomForm>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = ({ username }: CreatRoomForm) => {
    setIsLoading(true);
    socket.emit("create-room", {
      roomId,
      name: username,
    });
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <div>
          <p className="mb-2 text-sm font-medium">Room ID</p>

          <div className="flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm text-gray-400">
            <span>{roomId}</span>
            <CopyButton value={roomId} />
          </div>
        </div>

        <Button type="submit" className="mt-2 w-full">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Create a Room"
          )}
        </Button>
      </form>
    </Form>
  );
}
