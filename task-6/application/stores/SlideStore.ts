import type Slide from "@/types/Slide";
import { create } from "zustand";

type SlideStore = {
  currentSlide: number | null;
  slides: Slide[];
  addSlide: (slide: Slide) => void;
  deleteSlide: (id: number) => void;
  setCurrentSlide: (id: number | null) => void;
  updateSlide: (id: number, data: Slide) => void;
  setPresentation: (data: Slide[]) => void;
};

const useSlideStore = create<SlideStore>()((set) => ({
  currentSlide: null,
  slides: [],
  addSlide: (slide: Slide) =>
    set((state) => ({ slides: [...state.slides, slide] })),
  deleteSlide: (id: number) =>
    set((state) => ({
      slides: state.slides.filter((slide) => slide.id !== id),
    })),
  setCurrentSlide: (id: number | null) => set({ currentSlide: id }),
  updateSlide: (id: number, data: Slide) => {
    set((state) => ({
      slides: state.slides.map((slide) => (slide.id === id ? data : slide)),
    }));
  },
  setPresentation: (data: Slide[]) => set({ slides: data }),
}));

export default useSlideStore;
