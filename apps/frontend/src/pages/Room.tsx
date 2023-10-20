import { socket } from "@/lib/socket";
import { useRoomStore } from "@/stores/roomStore";
import { User, useUserStore } from "@/stores/userStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoaderData, LoaderFunction } from "react-router-typesafe";

export const loader = (({ params }) => ({
  roomId: params.roomId,
})) satisfies LoaderFunction;

export default function Room() {
  const { roomId } = useLoaderData<typeof loader>();
  const user = useUserStore(state => state.user);
  const admin = useRoomStore(state => state.admin);
  const members = useRoomStore(state => state.members);
  const setMembers = useRoomStore(state => state.setMembers);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }

    socket.on("update-members", (members: User[]) => {
      setMembers(members);
    });

    return () => {
      socket.off("update-members");
    };
  }, [navigate, user, setMembers]);
  return (
    <div>
      {/* <div className="w-[100vw] h-[100vh]">
        <Excalidraw
          onChange={(element, appState, files) => {
            // console.log(element);
            // console.log(appState);
            // console.log(files);
          }}
          isCollaborating={true}
          // onPointerUpdate={(payload) => {
          //   console.log(payload);
          // }}
          // viewModeEnabled={true}
        />
      </div> */}
      Room ID {roomId} <div>Admin {admin?.name}</div>
      <div>user {user?.name}</div>
      {members.map(member => {
        return <div key={member.socketId}>Member {member.name}</div>;
      })}
    </div>
  );
}
