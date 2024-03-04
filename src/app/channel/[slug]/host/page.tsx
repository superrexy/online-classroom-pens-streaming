"use client";

import React, { useCallback } from "react";
import { joinStreaming } from "../../../../services/streaming.service";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useLocalParticipant,
} from "@livekit/components-react";
import HostControls from "../../../../components/host-controls";

const ChannelHostPage = ({ params }: { params: { slug: string } }) => {
  const [streaming, setStreaming] = React.useState<StreamingResponse>({});

  const fetchStreaming = useCallback(async () => {
    const data = await joinStreaming({ slug: params.slug, is_host: true });

    setStreaming(data.data);
  }, [params.slug]);

  React.useEffect(() => {
    fetchStreaming();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (streaming.token_channel == null) {
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
    >
      <div className="w-full bg-teal-600 mb-5 py-3">
        <div className="w-full flex items-center justify-between container mx-auto">
          <p className="text-sm font-light">
            Ready to stream as
            <span className="font-semibold ml-0.5">
              {" "}
              {streaming.streaming?.slug ?? ""}
            </span>
          </p>
        </div>
      </div>

      <HostControls />
    </LiveKitRoom>
  );
};

export default ChannelHostPage;
