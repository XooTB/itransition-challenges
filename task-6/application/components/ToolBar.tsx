"use client";

import type React from "react";
import useToolBar from "@/hooks/useToolBar";
import { Circle, Image, Square, SquarePlus, Type } from "lucide-react";
import { useStore } from "zustand";
import useSlideStore from "@/stores/SlideStore";
import { FabricJSEditor } from "fabricjs-react";

interface ToolProps {
  children: React.ReactNode;
  handleClick: () => void;
}

const Tool: React.FC<ToolProps> = ({ children, handleClick }) => {
  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center justify-center p-2 hover:text-white hover:bg-gray-700 rounded-lg hover:cursor-pointer"
    >
      {children}
    </button>
  );
};

const toolList = [
  {
    id: 1,
    name: "Add Slide",
    icon: <SquarePlus />,
  },
  {
    id: 2,
    name: "Add Text",
    icon: <Type />,
  },
  {
    id: 3,
    name: "Add Image",
    icon: <Image />,
  },
  {
    id: 4,
    name: "Square",
    icon: <Square />,
  },
  {
    id: 5,
    name: "Circle",
    icon: <Circle />,
  },
];

interface ToolBarProps {
  editor: FabricJSEditor | undefined;
}

const ToolBar: React.FC<ToolBarProps> = ({ editor }) => {
  const { newSlide, addText, addImage, addRectangle, addCircle } =
    useToolBar(editor);
  const { slides, currentSlide } = useStore(useSlideStore);
  // console.log(`Slides in Store:`, slides);
  // console.log(`Current Slide:`, currentSlide);

  const handleClick = (id: number) => {
    switch (id) {
      case 1:
        newSlide();
        break;
      case 2:
        addText();
        break;
      case 3:
        addImage();
        break;
      case 4:
        addRectangle();
        break;
      case 5:
        addCircle();
        break;
      default:
        break;
    }
  };

  return (
    <div className="fixed w-2/3 bg-gray-300 gap-1 top-16 px-10 py-2 flex rounded-lg">
      {toolList.map((tool, index) => (
        <Tool key={tool.id} handleClick={() => handleClick(tool.id)}>
          {tool.icon}
        </Tool>
      ))}
    </div>
  );
};

export default ToolBar;
