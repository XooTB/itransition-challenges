import { useState } from "react";

interface createPresentationProps {
  creator: string;
  title: string;
  presentation: any[];
}

const useCreateNewPresentation = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [presentation, setPresentation] = useState<any>(null);

  const createPresentation = async ({
    creator,
    title,
    presentation,
  }: createPresentationProps) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creator,
          title,
          data: presentation,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setPresentation(data);
      return data;
    } catch (error) {
      setError("An error occurred while creating the presentation");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createPresentation,
    isLoading,
    error,
    presentation,
  };
};

export default useCreateNewPresentation;
