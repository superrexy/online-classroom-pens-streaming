import {
  ConnectionQualityIndicator,
  ControlBar,
  ParticipantName,
  useConnectionState,
  useRemoteParticipant,
  useRoomInfo,
  useTracks,
} from "@livekit/components-react";
import { ConnectionState, Participant, Track } from "livekit-client";
import React, { useEffect, useRef } from "react";

function toString(connectionState: string) {
  switch (connectionState) {
    case "connected":
      return "Connected!";
    case "connecting":
      return "Connecting...";
    case "disconnected":
      return "Disconnected";
    case "reconnecting":
      return "Reconnecting";
    default:
      return "Unknown";
  }
}

export enum VideoQualityInterface {
  Low = "low",
  Medium = "medium",
  High = "high",
  auto = "auto",
}

const StreamPlayerWrapper = ({
  slug,
  onQualityChange,
}: {
  slug: string;
  onQualityChange?: (quality: VideoQualityInterface) => void;
}) => {
  const connectionState = useConnectionState();
  const participants = useRemoteParticipant(slug);
  const tracks = useTracks(Object.values(Track.Source)).filter(
    (track) => track.participant.identity
  );

  if (connectionState !== ConnectionState.Connected || !participants) {
    return (
      <>
        <main className="container mx-auto grid grid-cols-3 space-x-10">
          <div className="aspect-video col-span-2 w-full h-full flex items-center justify-center bg-gray-50/15 rounded-lg">
            {connectionState === ConnectionState.Connected
              ? "Stream is offline"
              : toString(connectionState)}
          </div>
          <div className="bg-gray-100/15 rounded p-4 h-min">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold">Channel Info</h1>
              <div className="flex items-center space-x-2">
                <span className="text-sm ml-2 font-light">
                  {false ? "Live" : "Offline"}
                </span>
                {false && (
                  <div className="size-4 bg-red-600 rounded-full">&nbsp;</div>
                )}
              </div>
            </div>

            <p className="text-sm font-light mt-2">{slug}</p>
          </div>
        </main>
      </>
    );
  } else if (tracks.length === 0) {
    return (
      <>
        <div className="flex aspect-video h-1/2 w-1/2 mx-auto items-center justify-center bg-black text-sm uppercase text-white">
          <div className="flex gap-2">
            <div className="h-4 w-4 rounded-full bg-neutral-400 animate-bounce delay-100" />
            <div className="h-4 w-4 rounded-full bg-neutral-500 animate-bounce delay-200" />
            <div className="h-4 w-4 rounded-full bg-neutral-600 animate-bounce delay-300" />
          </div>
        </div>
      </>
    );
  }

  return (
    <StreamPlayer
      participant={participants}
      onQualityChange={onQualityChange}
    />
  );
};

export const StreamPlayer = ({
  participant,
  onQualityChange,
}: {
  participant: Participant;
  onQualityChange?: (quality: VideoQualityInterface) => void;
}) => {
  const [quality, setQuality] = React.useState<VideoQualityInterface>(
    VideoQualityInterface.High
  );
  const videoEl = useRef<HTMLVideoElement>(null);

  const onQualityChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quality = e.target.value as VideoQualityInterface;
    setQuality(quality);
    onQualityChange?.(quality);
  };

  useTracks(Object.values(Track.Source))
    .filter((track) => track.participant.permissions)
    .forEach((track) => {
      if (videoEl.current) {
        track.publication.track?.attach(videoEl.current);
      }
    });

  return (
    <main className="container mx-auto grid grid-cols-3 space-x-10">
      <div className="aspect-video bg-red-400 col-span-2">
        <video className="object-cover w-full h-full" ref={videoEl}></video>
      </div>

      <div>
        <div className="bg-gray-100/15 rounded p-4 h-min">
          <div className="flex items-center justify-between ">
            <h1 className="text-lg font-semibold">Channel Info</h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm ml-2 font-light">
                {true ? "Live" : "Offline"}
              </span>
              {true && (
                <div className="size-4 bg-red-600 rounded-full">&nbsp;</div>
              )}
            </div>
          </div>

          <ParticipantName
            participant={participant}
            className="text-sm font-light mt-2"
          />

          <div className="w-full h-full">
            <ConnectionQualityIndicator participant={participant} />
          </div>
        </div>

        <div className="bg-gray-100/15 rounded p-4 h-min mt-5">
          <h1 className="text-lg font-semibold">Quality Streaming</h1>

          <ul className="space-y-3 mt-3">
            <li className="flex items-center space-x-3">
              <input
                type="radio"
                id="videoQualityHigh"
                name="videoQuality"
                className="radio"
                onChange={onQualityChangeHandler}
                value={VideoQualityInterface.High}
                checked={quality === VideoQualityInterface.High}
              />
              <label htmlFor="videoQualityHigh" className="radio-label">
                High
              </label>
            </li>
            <li className="flex items-center space-x-3">
              <input
                type="radio"
                id="videoQualityMedium"
                name="videoQuality"
                className="radio"
                onChange={onQualityChangeHandler}
                value={VideoQualityInterface.Medium}
                checked={quality === VideoQualityInterface.Medium}
              />
              <label htmlFor="videoQualityMedium" className="radio-label">
                Medium
              </label>
            </li>
            <li className="flex items-center space-x-3">
              <input
                type="radio"
                id="videoQualityLow"
                name="videoQuality"
                className="radio"
                onChange={onQualityChangeHandler}
                value={VideoQualityInterface.Low}
                checked={quality === VideoQualityInterface.Low}
              />
              <label htmlFor="videoQualityLow" className="radio-label">
                Low
              </label>
            </li>
            <li className="flex items-center space-x-3">
              <input
                type="radio"
                id="videoQualityAuto"
                name="videoQuality"
                className="radio"
                onChange={onQualityChangeHandler}
                value={VideoQualityInterface.auto}
                checked={quality === VideoQualityInterface.auto}
              />
              <label htmlFor="videoQualityAuto" className="radio-label">
                Auto
              </label>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default StreamPlayerWrapper;
