"use client";

import React, { useCallback } from "react";
import { joinStreaming } from "../../../services/streaming.service";
import {
  LiveKitRoom,
  ParticipantName,
  RoomAudioRenderer,
} from "@livekit/components-react";
import StreamPlayerWrapper, {
  VideoQualityInterface,
} from "../../../components/stream-player";
import {
  LocalTrack,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  Track,
  VideoQuality,
} from "livekit-client";

const ChannelPage = ({ params }: { params: { slug: string } }) => {
  const [streaming, setStreaming] = React.useState<StreamingResponse>({});
  const [quality, setQuality] = React.useState<number | null>(null);

  const [room, setRoom] = React.useState<Room>(
    () =>
      new Room({
        adaptiveStream: false,
        dynacast: true,
        publishDefaults: {
          simulcast: true,
          videoCodec: "vp9",
        },
      })
  );

  const handleQualityChange = (qualityOpt: VideoQualityInterface) => {
    switch (qualityOpt) {
      case VideoQualityInterface.High: {
        room.remoteParticipants.forEach((participant) => {
          if (participant.identity === params.slug) {
            participant.trackPublications.forEach((publication) => {
              if (publication.kind === Track.Kind.Video) {
                setQuality(2);
                publication.setVideoQuality(2);
              }
            });
          }
        });
        break;
      }
      case VideoQualityInterface.Medium: {
        room.remoteParticipants.forEach((participant) => {
          if (participant.identity === params.slug) {
            participant.trackPublications.forEach((publication) => {
              if (publication.kind === Track.Kind.Video) {
                setQuality(1);
                publication.setVideoQuality(1);
              }
            });
          }
        });
        break;
      }
      case VideoQualityInterface.Low: {
        room.remoteParticipants.forEach((participant) => {
          if (participant.identity === params.slug) {
            participant.trackPublications.forEach((publication) => {
              if (publication.kind === Track.Kind.Video) {
                setQuality(0);
                publication.setVideoQuality(0);
              }
            });
          }
        });
        break;
      }

      case VideoQualityInterface.auto: {
        setRoom(
          () =>
            new Room({
              adaptiveStream: true,
              dynacast: true,
              publishDefaults: {
                simulcast: true,
                videoCodec: "vp9",
              },
            })
        );
        break;
      }
    }
  };

  const handleTrackSubscribed = useCallback(
    (
      track: RemoteTrack,
      publication: RemoteTrackPublication,
      participant: RemoteParticipant
    ) => {
      console.log("Track Changed");
      if (track.kind === Track.Kind.Video) {
        if (quality) {
          publication.setVideoQuality(quality);
        }
      }
    },
    [quality]
  );

  const fetchStreaming = useCallback(async () => {
    const data = await joinStreaming({ slug: params.slug, is_host: false });

    setStreaming(data.data);
  }, [params.slug]);

  React.useEffect(() => {
    fetchStreaming();
  }, [params.slug, fetchStreaming]);

  React.useEffect(() => {
    room.on("trackSubscribed", handleTrackSubscribed);
    // Console Log Check Quality Video on ROOM
  }, [quality, room, handleTrackSubscribed]);

  if (streaming?.token_channel == null) {
    return (
      <div className="container mx-auto flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      token={streaming.token_channel}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
      room={room}
    >
      <div className="w-full flex items-center justify-center bg-teal-600 p-1 mb-5">
        <p className="text-sm font-light">
          Watching as
          <span className="font-semibold ml-0.5">
            {" "}
            {streaming.identity ?? ""}
          </span>
        </p>
      </div>

      <StreamPlayerWrapper
        slug={streaming.streaming?.slug!}
        onQualityChange={handleQualityChange}
      />
    </LiveKitRoom>
  );
};

export default ChannelPage;
