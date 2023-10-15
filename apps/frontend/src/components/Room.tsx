import { nanoid } from "nanoid";
import CreateRoomForm from "./CreateRoomForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import JoinRoomButton from "@/components/JoinRoomButton";

export default function Room() {
  const roomID = nanoid();
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Whiteboard prototype</CardTitle>
          <CardDescription>
            Convey your ideas to your friends on an excalidraw board
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col space-y-4">
          <CreateRoomForm roomID={roomID} />

          <div className="flex items-center space-x-2 ">
            <Separator />
            <span className="text-xs text-gray-400">OR</span>
            <Separator />
          </div>

          <JoinRoomButton />
        </CardContent>
      </Card>
    </div>
  );
}
