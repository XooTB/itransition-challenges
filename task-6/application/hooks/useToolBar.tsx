"use client";

import { useRef, useState } from "react";
import { useStore } from "zustand";
import useSlideStore from "@/stores/SlideStore";
import type Slide from "@/types/Slide";
import { FabricJSEditor } from "fabricjs-react";
import * as fabric from "fabric";

const useToolBar = (editor: FabricJSEditor | undefined) => {
  const { addSlide, slides, setCurrentSlide } = useStore(useSlideStore);

  // console.log("Slides at", new Date().toISOString(), ":", slides);

  const newSlide = () => {
    const slide: Slide = {
      id: slides[slides?.length - 1]?.id + 1 || 1,
      slideData: {
        version: "6.4.2",
        objects: [],
      },
    };
    addSlide(slide);
    if (slides.length === 0) {
      setCurrentSlide(slide.id);
    }
  };
  const addText = () => {
    if (editor) {
      const text = new fabric.Textbox("Add your text here.", {
        left: 100,
        top: 100,
      });

      editor.canvas.add(text);
    }
  };
  const addImage = () => {};
  const addRectangle = () => {
    editor?.addRectangle();
  };
  const addCircle = () => {
    editor?.addCircle();
  };

  return { newSlide, addText, addImage, addRectangle, addCircle };
};

export default useToolBar;
