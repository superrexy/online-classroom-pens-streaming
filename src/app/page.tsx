"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import fetcher from "../config/axios";
import toast from "react-hot-toast";

export default function Home() {
  const router = useRouter();

  const [channelId, setChannelId] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const handleHost = async () => {
    const response = await fetcher.post("/api/v1/streamings", {
      title: channelId,
    });

    if (response.status === 201) {
      toast.success("Channel created!");
      router.push(`/channel/${response.data.data.slug}/host`);
    } else {
      toast.error("Failed to create channel!");
    }
  };

  const handleViewer = async () => {
    const response = await fetcher.get(`/api/v1/streamings/${channelId}`);

    if (response.status === 200) {
      toast.success("Channel found!");
      router.push(`/channel/${response.data.data.slug}`);
    } else {
      toast.error("Channel not found!");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChannelId(e.target.value);
  };

  useEffect(() => {
    const validChannelIdSlug = /^[a-z0-9-]+$/;

    const disabled =
      channelId.length === 0 || !validChannelIdSlug.test(channelId);

    setButtonDisabled(disabled);
  }, [channelId]);

  return (
    <main className="container mx-auto max-w-2xl mt-10">
      <h2 className="font-semibold text-2xl">
        Onlien Classroom PENS Streaming
      </h2>
      <p className="mt-3">
        To get started, enter a channel ID below and select an option:
      </p>
      <div className="mt-5 space-x-4">
        <input
          type="text"
          placeholder="belajar-mengajar"
          className="input input-bordered w-full max-w-xs"
          onChange={handleChange}
        />
        <button
          className="btn btn-primary text-white text-sm font-medium"
          disabled={buttonDisabled}
          onClick={handleHost}
        >
          Join as host
        </button>
        <button
          className="btn btn-outline btn-accent text-white text-sm font-medium"
          disabled={buttonDisabled}
          onClick={handleViewer}
        >
          Join as viewer
        </button>
      </div>
    </main>
  );
}
