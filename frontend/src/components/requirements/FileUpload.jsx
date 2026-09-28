// src/components/requirements/FileUpload.jsx

import { useState, useRef } from "react";
import {
  Upload,
  ImagePlus,
  X,
  FileCheck,
  Sparkles,
  AlertCircle,
  Eye,
} from "lucide-react";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Sample reference presets that users can click to quickly add realistic demo references
const SAMPLE_PRESETS = [
  {
    name: "Resin Ocean Waves",
    url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
    category: "Resin Art",
  },
  {
    name: "Gold Foil Nameplate",
    url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
    category: "Resin Art",
  },
  {
    name: "Handcrafted Teak Base",
    url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
    category: "Woodwork",
  },
  {
    name: "Floral Arch Inspiration",
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
    category: "Decor",
  },
];

export default function FileUpload({
  files = [],
  onFilesChange,
  maxFiles = 5,
  label = "Upload Reference Images",
  description = "Show the creator the colors, textures, dimensions, or design ideas you have in mind.",
  allowPresets = true,
  category = "",
}) {
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [previewModalImage, setPreviewModalImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFiles = (incomingFileList) => {
    setErrorMsg("");
    const newFiles = [...files];

    for (let i = 0; i < incomingFileList.length; i++) {
      if (newFiles.length >= maxFiles) {
        setErrorMsg(`Maximum of ${maxFiles} reference images allowed.`);
        break;
      }

      const file = incomingFileList[i];
      if (!ALLOWED_TYPES.includes(file.type)) {
        setErrorMsg("Please upload JPG, PNG, or WebP images only.");
        continue;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        setErrorMsg("Each image must be under 5 MB in size.");
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      newFiles.push({
        id: `upload-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        url: previewUrl,
        isCustomFile: true,
      });
    }

    if (onFilesChange) {
      onFilesChange(newFiles);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (fileId, e) => {
    e.stopPropagation();
    const updated = files.filter((f) => f.id !== fileId);
    if (onFilesChange) {
      onFilesChange(updated);
    }
  };

  const addPreset = (preset) => {
    setErrorMsg("");
    if (files.length >= maxFiles) {
      setErrorMsg(`Maximum of ${maxFiles} reference images allowed.`);
      return;
    }
    const alreadyAdded = files.some((f) => f.url === preset.url);
    if (alreadyAdded) return;

    const newFiles = [
      ...files,
      {
        id: `preset-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: preset.name,
        size: "Sample",
        url: preset.url,
        isPreset: true,
      },
    ];

    if (onFilesChange) {
      onFilesChange(newFiles);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-ink">
          {label}
        </label>
        <span className="text-xs text-ink-muted">
          {files.length} / {maxFiles} images
        </span>
      </div>

      {description && (
        <p className="text-xs text-ink-soft leading-relaxed">
          {description}
        </p>
      )}

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all
          ${
            dragOver
              ? "border-amber bg-amber/5 scale-[1.005]"
              : "border-border hover:border-amber/60 bg-cream/30 hover:bg-cream/50"
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
            e.target.value = "";
          }}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-2.5">
          <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-border flex items-center justify-center text-amber-dark group-hover:scale-105 transition-transform">
            <Upload size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-ink">
              <span className="text-amber-dark underline underline-offset-2">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-ink-muted mt-1">
              Supports JPG, PNG, WebP (Max 5 MB each)
            </p>
          </div>
        </div>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="flex items-center gap-2 text-xs text-rose-dark bg-rose/10 border border-rose/20 rounded-xl px-3 py-2">
          <AlertCircle size={14} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Selected previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
          {files.map((file) => (
            <div
              key={file.id}
              className="group relative aspect-square rounded-xl overflow-hidden border border-border bg-white shadow-xs"
            >
              <img
                src={file.url}
                alt={file.name || "Reference"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewModalImage(file.url);
                  }}
                  title="View full image"
                  className="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-ink flex items-center justify-center shadow-xs transition-colors"
                >
                  <Eye size={13} />
                </button>
                <button
                  type="button"
                  onClick={(e) => handleRemove(file.id, e)}
                  title="Remove image"
                  className="w-7 h-7 rounded-full bg-rose text-white hover:bg-rose-dark flex items-center justify-center shadow-xs transition-colors"
                >
                  <X size={13} />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-[10px] text-white truncate px-1 font-medium">
                  {file.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sample Reference Presets */}
      {allowPresets && (
        <div className="pt-2">
          <div className="flex items-center gap-1.5 text-xs text-ink-muted mb-2">
            <Sparkles size={13} className="text-amber-dark" />
            <span>Need inspiration? Quick-add sample references:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_PRESETS.map((preset) => {
              const isAdded = files.some((f) => f.url === preset.url);
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => addPreset(preset)}
                  disabled={isAdded || files.length >= maxFiles}
                  className={`
                    text-xs px-2.5 py-1 rounded-full border transition-all flex items-center gap-1.5
                    ${
                      isAdded
                        ? "bg-forest/10 border-forest text-forest font-medium cursor-default"
                        : "bg-white border-border text-ink-soft hover:border-amber hover:text-amber-dark"
                    }
                  `}
                >
                  {isAdded ? (
                    <FileCheck size={11} className="text-forest" />
                  ) : (
                    <ImagePlus size={11} className="text-amber-dark" />
                  )}
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Full Preview Modal */}
      {previewModalImage && (
        <div
          onClick={() => setPreviewModalImage(null)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl max-h-[85vh] bg-white rounded-2xl overflow-hidden shadow-2xl p-2 border border-border"
          >
            <button
              type="button"
              onClick={() => setPreviewModalImage(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              <X size={16} />
            </button>
            <img
              src={previewModalImage}
              alt="Reference Preview"
              className="max-h-[80vh] w-auto object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
