import { getUploadSignature } from "../integrations/cloudinary";

export class MediaService {
  public createUploadSignature(input: { folder: string }) {
    return getUploadSignature(input.folder);
  }
}
