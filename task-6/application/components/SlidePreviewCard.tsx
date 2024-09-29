import React from "react";
import type Slide from "@/types/Slide";
import { Delete, Trash, Trash2 } from "lucide-react";
import { useStore } from "zustand";
import useSlideStore from "@/stores/SlideStore";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";

type Props = {
  slide: Slide;
};

const SlidePreviewCard = ({ slide }: Props) => {
  const { deleteSlide, setCurrentSlide, slides } = useStore(useSlideStore);
  const { editor, onReady } = useFabricJSEditor();

  const handleRemoveSlide = () => {
    deleteSlide(slide.id);
    setCurrentSlide(slides[0].id);
  };

  const handleClick = () => {
    setCurrentSlide(slide.id);
  };

  React.useEffect(() => {
    if (editor && slide.slideData) {
      editor.canvas.loadFromJSON(slide.slideData, () => {
        editor.canvas.requestRenderAll();
      });

      // Adjust canvas size to fit the preview card
      editor.canvas.setDimensions({
        width: 330,
        height: 150,
      });

      editor.canvas.requestRenderAll();
    }
  }, [editor, slide.slideData]);

  return (
    <div className="relative border border-gray-300 w-full h-full rounded-lg hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div
        onClick={handleRemoveSlide}
        className="absolute top-2 right-2 p-2 rounded-full bg-white hover:bg-red-500 text-gray-600 hover:text-white transition-colors duration-200 cursor-pointer z-20"
      >
        <Trash2 size={16} />
      </div>

      <div
        onClick={handleClick}
        className="w-full h-full hover:cursor-pointer relative"
      >
        <FabricJSCanvas onReady={onReady} className="w-full h-full border" />
        <div className="absolute top-0 left-0 w-full h-full z-10"></div>
      </div>
    </div>
  );
};

export default SlidePreviewCard;
