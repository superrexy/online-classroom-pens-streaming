import { useLocalParticipant } from "@livekit/components-react";
import { LocalTrack, Track, createLocalTracks } from "livekit-client";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface Props {}

const HostControls = ({}: Props) => {
  const [videoTrack, setVideoTrack] = useState<LocalTrack>();
  const [audioTrack, setAudioTrack] = useState<LocalTrack>();
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [isUnpublishing, setIsUnpublishing] = React.useState(false);

  const { localParticipant } = useLocalParticipant();

  const previewVideoEl = useRef<HTMLVideoElement>(null);

  const createTracks = async () => {
    const tracks = await createLocalTracks({ audio: true, video: true });
    tracks.forEach((track) => {
      switch (track.kind) {
        case Track.Kind.Video: {
          if (previewVideoEl?.current) {
            track.attach(previewVideoEl.current);
          }
          setVideoTrack(track);
          break;
        }
        case Track.Kind.Audio: {
          setAudioTrack(track);
          break;
        }
      }
    });
  };

  useEffect(() => {
    void createTracks();
  }, []);

  useEffect(() => {
    return () => {
      videoTrack?.stop();
      audioTrack?.stop();
    };
  }, [videoTrack, audioTrack]);

  const togglePublishing = useCallback(async () => {
    if (isPublishing && localParticipant) {
      setIsUnpublishing(true);

      if (videoTrack) {
        void localParticipant.unpublishTrack(videoTrack);
      }
      if (audioTrack) {
        void localParticipant.unpublishTrack(audioTrack);
      }

      await createTracks();

      setTimeout(() => {
        setIsUnpublishing(false);
      }, 2000);
    } else if (localParticipant) {
      if (videoTrack) {
        void localParticipant.publishTrack(videoTrack);
      }
      if (audioTrack) {
        void localParticipant.publishTrack(audioTrack);
      }
    }

    setIsPublishing((prev) => !prev);
  }, [audioTrack, isPublishing, localParticipant, videoTrack]);

  return (
    <main className="container mx-auto grid grid-cols-3 space-x-10">
      <div className="aspect-video bg-white rounded overflow-hidden col-span-2">
        <video
          className="object-cover w-full h-full"
          ref={previewVideoEl}
        ></video>
      </div>
      <div className="bg-gray-100/15 rounded p-4 h-min">
        <div className="flex mb-3 items-center justify-between">
          <h1 className="text-xl font-semibold">Control Stream</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm ml-2 font-light">
              {isPublishing ? "Live" : "Offline"}
            </span>
            {isPublishing && (
              <div className="size-4 bg-red-600 rounded-full">&nbsp;</div>
            )}
          </div>
        </div>
        {isPublishing ? (
          <button
            className="btn btn-sm btn-warning text-white text-sm font-medium"
            disabled={isUnpublishing}
            onClick={() => void togglePublishing()}
          >
            {isUnpublishing ? "Stopping..." : "Stop Stream"}
          </button>
        ) : (
          <button
            className="btn btn-sm btn-primary text-white text-sm font-medium"
            onClick={() => void togglePublishing()}
          >
            Start Stream
          </button>
        )}
      </div>
    </main>
  );
};

export default HostControls;
