import { useState, useEffect } from "react";
import type Slide from "@/types/Slide";

interface Presentation {
  id: string;
  title: string;
  creator: string;
  slides: Slide[];
}

const useGetPresentation = () => {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPresentations = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/presentations`
      );
      const data = await response.json();
      setPresentations(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  return { fetchPresentations, presentations, loading, error };
};

export default useGetPresentation;
