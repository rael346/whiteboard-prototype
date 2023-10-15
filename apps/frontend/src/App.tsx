import { useEffect, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { socket } from "./lib/socket";
import Room from "@/components/Room";

function App() {
  useEffect(() => {
    socket.emit("hello from client", "hello client here");

    socket.on("hello from server", () => {
      console.log("server said hello");
    });

    return () => {
      socket.off("hello from server");
    };
  }, []);
  return (
    <>
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
      <Room />
    </>
  );
}

export default App;
