"use client";

import useGetPresentation from "@/hooks/useGetPresentation";
import useUserStore from "@/stores/UserStore";
import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import useCreateNewPresentation from "@/hooks/useCreateNewPresentation";
import { Input } from "@/components/ui/input";

export default function Home() {
  const { nickname, setNickname } = useStore(useUserStore);
  const [inputNickname, setInputNickname] = useState("");
  const { presentations, loading, error, fetchPresentations } =
    useGetPresentation();
  const { createPresentation, isLoading, presentation } =
    useCreateNewPresentation();

  const [presentationName, setPresentationName] = useState("");
  const [inputError, setInputError] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (nickname) {
      return;
    }
  }, [nickname]);

  useEffect(() => {
    fetchPresentations();
  }, []);

  const handleCreatePresentation = async () => {
    if (presentationName.trim() === "") {
      setInputError("Presentation name cannot be empty");
      return;
    }

    const presentation = await createPresentation({
      creator: nickname,
      title: presentationName,
      presentation: [],
    });

    if (presentation) {
      router.push(`/${presentation.id}`);
    } else {
      console.error("No presentation created");
    }
  };

  if (!nickname) {
    return (
      <div className="flex flex-col items-center">
        <h1 className="text-2xl mb-4">Welcome! Please enter your nickname:</h1>
        <input
          type="text"
          value={inputNickname}
          onChange={(e) => setInputNickname(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 mb-4"
          placeholder="Your nickname"
        />
        <button
          onClick={() => setNickname(inputNickname)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    );
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="min-h-screen w-full flex flex-col items-center pt-10 bg-gray-100">
      <div className="flex flex-col gap-5 mb-8 justify-between w-1/2">
        <h1 className="text-3xl font-bold text-blue-600">
          Welcome, {nickname}!
        </h1>
        <div className="flex gap-4">
          <div className="flex flex-col gap-1 w-full">
            <Input
              value={presentationName}
              onChange={(e) => setPresentationName(e.target.value)}
              placeholder="Presentation Name"
              className="border border-gray-300 rounded px-3 py-2"
            />
            {inputError && <p className="text-red-500">{inputError}</p>}
          </div>
          <Button onClick={handleCreatePresentation}>
            Create Presentation
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-center w-full max-w-2xl">
        {presentations.map((presentation) => (
          <div
            key={presentation.id}
            className="bg-white shadow-md rounded-lg p-4 mb-4 w-full hover:shadow-lg transition duration-300 cursor-pointer"
            onClick={() => {
              router.push(`/${presentation.id}`);
            }}
          >
            <h2 className="text-xl font-semibold text-gray-800">
              {presentation.title}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Created by: {presentation.creator}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
