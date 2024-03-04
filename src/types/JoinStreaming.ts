interface StreamingResponse {
  streaming?: StreamingClass;
  token_channel?: string;
  identity?: string;
}

interface StreamingClass {
  id?: number;
  title?: string;
  slug?: string;
  recording_url?: string;
  is_live?: boolean;
  created_at?: Date;
  updated_at?: Date;
}
