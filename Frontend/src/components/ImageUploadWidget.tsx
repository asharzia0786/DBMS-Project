import { useEffect, useMemo, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';

import { useImageUpload } from '../lib/useImageUpload';

type ImageUploadWidgetProps = {
  token: string | null | undefined;
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  multiple?: boolean;
  label?: string;
};

export default function ImageUploadWidget({
  token,
  value,
  onChange,
  folder = 'luxury-cnc',
  multiple = true,
  label = 'Upload images',
}: ImageUploadWidgetProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const { uploading, progress, error, uploadFiles } = useImageUpload(token, folder);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  const allImages = useMemo(() => [...value, ...previews], [previews, value]);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) {
      return;
    }

    const selected = Array.from(files).filter((file) => file.type.startsWith('image/'));
    const nextPreviews = selected.map((file) => URL.createObjectURL(file));
    setPreviews(nextPreviews);

    const uploaded = await uploadFiles(multiple ? selected : selected.slice(0, 1));
    onChange(multiple ? [...value, ...uploaded.map((image) => image.url)] : [uploaded[0].url]);
    setPreviews([]);
  }

  function removeImage(url: string) {
    onChange(value.filter((item) => item !== url));
  }

  return (
    <div className="space-y-4">
      <label className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-champagne/30 bg-void/50 px-6 py-8 text-center transition-colors hover:border-champagne/60">
        <ImagePlus className="mb-3 text-champagne" size={28} />
        <span className="font-manrope text-[11px] uppercase tracking-[0.24em] text-champagne">
          {label}
        </span>
        <span className="mt-2 font-manrope text-xs text-beige/45">
          WebP, JPG, or PNG. Multiple files are supported.
        </span>
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          disabled={uploading}
          onChange={(event) => void handleFiles(event.target.files)}
        />
      </label>

      {uploading ? (
        <div className="border border-champagne/15 bg-walnut-900/70 p-4">
          <div className="flex items-center gap-3 font-manrope text-sm text-beige/70">
            <Loader2 className="animate-spin text-champagne" size={18} />
            Uploading images... {progress}%
          </div>
          <div className="mt-3 h-1 bg-void">
            <div className="h-full bg-champagne" style={{ width: `${progress}%` }} />
          </div>
        </div>
      ) : null}

      {error ? <p className="font-manrope text-sm text-red-300">{error}</p> : null}

      {allImages.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {allImages.map((url) => (
            <div key={url} className="relative aspect-square overflow-hidden border border-champagne/15 bg-void">
              <img src={url} alt="Upload preview" className="h-full w-full object-cover" />
              {value.includes(url) ? (
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center bg-void/80 text-champagne"
                  aria-label="Remove image"
                >
                  <X size={15} />
                </button>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
