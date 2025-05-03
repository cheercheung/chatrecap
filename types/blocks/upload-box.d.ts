import { Button } from "@/types/blocks/base";

export interface UploadBox {
  name?: string;
  disabled?: boolean;
  title?: string;
  description?: string;
  sample_button_text?: string;
  upload_button_text?: string;
  supported_formats?: string;
  primary_button?: Button;
  secondary_button?: Button;
  max_file_size?: number;
  placeholder?: string;
  sample_chat_text?: string;
}
