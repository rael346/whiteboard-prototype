import { nanoid } from "nanoid";
import CreateRoomForm from "../components/CreateRoomForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import JoinRoomButton from "@/components/JoinRoomButton";

export default function Main() {
  const roomId = nanoid();
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
          <CreateRoomForm roomId={roomId} />

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
