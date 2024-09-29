"use client";

import useSlideStore from "@/stores/SlideStore";
import React from "react";
import { useStore } from "zustand";
import SlidePreviewCard from "./SlidePreviewCard";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

const SlidesPreview = () => {
  const { slides } = useStore(useSlideStore);

  return (
    <div className="fixed bottom-0 left-4 w-[98%] mx-auto h-[200px] border-t-2 bg-white">
      <ScrollArea className="w-full h-full py-2 px-4">
        <div className="flex gap-4 h-full w-full">
          {slides && slides?.length > 0 ? (
            slides.map((slide) => (
              <div className="flex-shrink-0 w-1/4 h-[180px]" key={slide.id}>
                <SlidePreviewCard slide={slide} />
              </div>
            ))
          ) : (
            <div className="flex-shrink-0 w-full h-[180px] flex items-center justify-center">
              <p className="text-gray-500">No slides available</p>
            </div>
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default SlidesPreview;
