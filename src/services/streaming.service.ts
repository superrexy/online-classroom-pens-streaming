import fetcher from "../config/axios";
import { APIResponse } from "../types/APIResponse";

const joinStreaming = async ({
  slug,
  is_host,
}: {
  slug: string;
  is_host: boolean;
}): Promise<APIResponse<StreamingResponse>> => {
  const res = await fetcher.post<APIResponse<StreamingResponse>>(
    "/api/v1/streamings/join",
    {
      slug,
      is_host,
    }
  );

  return res.data;
};

export { joinStreaming };
