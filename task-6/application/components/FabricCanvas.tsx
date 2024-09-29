"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import type Slide from "@/types/Slide";
import { useStore } from "zustand";
import useSlideStore from "@/stores/SlideStore";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { Button } from "./ui/button";
import ToolBar from "./ToolBar";
import { ZoomIn, ZoomOut } from "lucide-react";
import * as fabric from "fabric";

interface FabricCanvasProps {
  updatePresentation: () => void;
}

const FabricCanvas = ({ updatePresentation }: FabricCanvasProps) => {
  const { slides, currentSlide, updateSlide } = useStore(useSlideStore);
  const [currentSlideData, setCurrentSlideData] = useState<Slide | null>(null);
  const [updated, setUpdated] = useState(false);

  const { editor, onReady } = useFabricJSEditor();

  const [canvasState, setCanvasState] = useState<Slide | null>(null);

  const deleteObject = (obj: fabric.Object) => {
    if (editor) {
      editor.canvas.remove(obj);
      editor.canvas.requestRenderAll();
    }
  };

  useEffect(() => {
    if (editor) {
      editor.canvas.requestRenderAll();
    }
  }, [slides]);

  useEffect(() => {
    if (editor && currentSlideData) {
      const updateCanvasState = () => {
        const json = editor.canvas.toJSON();
        setCanvasState({
          id: currentSlideData.id,
          slideData: json,
        });
      };

      editor.canvas.on("object:added", updateCanvasState);
      editor.canvas.on("object:modified", updateCanvasState);
      editor.canvas.on("object:removed", updateCanvasState);

      // Add keyboard event listener
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Delete") {
          const activeObject = editor.canvas.getActiveObject();
          if (activeObject) {
            deleteObject(activeObject);
          }
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      // Clean up the event listener
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        editor.canvas.off("object:added", updateCanvasState);
        editor.canvas.off("object:modified", updateCanvasState);
        editor.canvas.off("object:removed", updateCanvasState);
      };
    }
  }, [editor, currentSlideData]);

  useEffect(() => {
    if (canvasState) {
      updateSlide(canvasState.id, canvasState);
      setUpdated(true);
    }
  }, [canvasState]);

  useEffect(() => {
    if (updated) {
      updatePresentation();
      setUpdated(false);
    }
  }, [updated]);

  useEffect(() => {
    if (editor && currentSlideData && currentSlideData.slideData) {
      editor.canvas.loadFromJSON(currentSlideData.slideData, () => {
        editor.canvas.requestRenderAll();
      });
    }
  }, [editor, currentSlideData]);

  useEffect(() => {
    if (currentSlide !== null) {
      const selectedSlide = slides?.find((slide) => slide.id === currentSlide);
      setCurrentSlideData(selectedSlide || null);
    } else {
      setCurrentSlideData(null);
    }
  }, [currentSlide]);

  const handleZoomIn = () => {
    editor?.zoomIn();
  };

  const handleZoomOut = () => {
    editor?.zoomOut();
  };

  return (
    <div className="w-full px-36 h-[60vh] flex flex-col items-center gap-5">
      <ToolBar editor={editor} />
      {slides?.length > 0 && currentSlide !== null ? (
        <>
          <div className="flex gap-2">
            <Button onClick={handleZoomIn}>
              <ZoomIn />
            </Button>
            <Button onClick={handleZoomOut}>
              <ZoomOut />{" "}
            </Button>
          </div>
          <FabricJSCanvas
            className="sample-canvas border w-full h-[60vh]"
            onReady={onReady}
          />
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-2xl text-gray-500">
            {slides?.length === 0
              ? "Add a slide to start editing"
              : "Select a slide to start editing"}
          </p>
        </div>
      )}
    </div>
  );
};

export default FabricCanvas;
