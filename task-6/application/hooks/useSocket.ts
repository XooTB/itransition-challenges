import { io } from "socket.io-client";
import useSlideStore from "../stores/SlideStore";
import { useStore } from "zustand";
import { useState } from "react";
import Slide from "@/types/Slide";

const useSocket = (presentationId: string) => {
  const socket = io(process.env.NEXT_PUBLIC_API_URL as string);
  const { setPresentation, slides } = useStore(useSlideStore);

  const [pres, setPres] = useState<Slide[]>([]);

  socket.on("connect", () => {});

  socket.on("disconnect", () => {});

  const joinPresentation = () => {
    socket.emit("join_presentation", presentationId);
  };

  const updatePresentation = () => {
    const updatedPresentation = {
      presentationId,
      presentation: slides,
    };
    socket.emit("update_presentation", updatedPresentation);
  };

  socket.on("presentation_updated", (updatedPresentation: any) => {
    setPresentation(updatedPresentation.presentation);
    setPres(updatedPresentation.presentation);
  });

  socket.on("update_error", (error: { message: string }) => {
    console.error("Error updating presentation:", error.message);
  });

  return {
    socket,
    joinPresentation,
    updatePresentation,
  };
};

export default useSocket;
