"use client";

import FabricCanvas from "@/components/FabricCanvas";
import SlidesPreview from "@/components/SlidesPreview";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import useUserStore from "@/stores/UserStore";
import { useStore } from "zustand";
import useSocket from "@/hooks/useSocket";

const page = () => {
  const router = useRouter();
  const { nickname } = useStore(useUserStore);
  const { presentationId } = useParams();
  const { socket, joinPresentation, updatePresentation } = useSocket(
    presentationId as string
  );

  useEffect(() => {
    joinPresentation();
  }, []);

  useEffect(() => {
    if (!nickname) {
      router.push("/");
    }
  }, []);

  return (
    <main className="w-full h-[80vh] flex pt-20 justify-center">
      <SlidesPreview />
      <FabricCanvas updatePresentation={updatePresentation} />
    </main>
  );
};

export default page;
