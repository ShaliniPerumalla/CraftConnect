// src/components/requirements/FileUpload.jsx

import { useState } from "react";
import { Upload, X, Image as ImageIcon, Sparkles } from "lucide-react";

const SAMPLE_PRESETS = [
  {
    name: "Resin Nameplate sample",
    url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Gold Flake Resin Decor",
    url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Handcrafted Woodwork",
    url: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Ceramic Glaze Plate",
    url: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80",
  },
];

export default function FileUpload({
  images = [],
  onChange,
  maxFiles = 4,
  label = "Upload Reference Images",
  hint = "Upload sketches, color palettes, or reference photos (Max 5MB each)",
}) {
  const [dragActive, setDragActive] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(
      (file) =>
        ["image/jpeg", "image/png", "image/webp"].includes(file.type) &&
        file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length === 0) {
      alert("Please upload valid image files (JPG, PNG, WEBP) under 5MB.");
      return;
    }

    // Convert to local object URLs for immediate preview
    const newImageUrls = validFiles.map((file) => URL.createObjectURL(file));
    const combined = [...images, ...newImageUrls].slice(0, maxFiles);
    onChange(combined);
  };

  const removeImage = (indexToRemove) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const addPresetImage = (url) => {
    if (images.length >= maxFiles) {
      alert(`Maximum ${maxFiles} images allowed.`);
      return;
    }
    if (!images.includes(url)) {
      onChange([...images, url]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-ink">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPresets(!showPresets)}
            className="inline-flex items-center gap-1 text-xs text-amber-dark hover:underline font-medium"
          >
            <Sparkles size={12} />
            {showPresets ? "Hide sample inspiration" : "Pick from sample photos"}
          </button>
          <span className="text-xs text-ink-muted">
            {images.length}/{maxFiles}
          </span>
        </div>
      </div>

      {/* Preset Inspiration Chooser */}
      {showPresets && (
        <div className="p-3.5 bg-cream-dark/50 border border-border rounded-xl">
          <p className="text-xs text-ink-soft mb-2.5 font-medium">
            Click any inspiration sample to add to your requirement:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SAMPLE_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => addPresetImage(preset.url)}
                className="group relative rounded-lg overflow-hidden border border-border bg-white text-left hover:border-amber transition-all shadow-2xs"
              >
                <img
                  src={preset.url}
                  alt={preset.name}
                  className="w-full h-16 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="block p-1.5 text-[11px] font-medium text-ink truncate">
                  + {preset.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer
          ${
            dragActive
              ? "border-amber bg-amber/5 scale-[1.005]"
              : "border-border hover:border-amber/60 bg-cream/30 hover:bg-cream/60"
          }
        `}
      >
        <input
          id="custom-file-upload"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-2xl bg-white border border-border shadow-xs flex items-center justify-center text-amber-dark mb-3">
            <Upload size={20} />
          </div>

          <p className="text-sm font-medium text-ink">
            <span className="text-amber-dark underline font-semibold">
              Click to upload
            </span>{" "}
            or drag and drop images here
          </p>
          <p className="text-xs text-ink-soft mt-1">{hint}</p>
        </div>
      </div>

      {/* Uploaded Images Preview Strip */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {images.map((imgUrl, index) => (
            <div
              key={index}
              className="relative group rounded-xl overflow-hidden border border-border bg-white aspect-square shadow-xs"
            >
              <img
                src={imgUrl}
                alt={`Reference ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="w-6 h-6 rounded-full bg-white text-ink flex items-center justify-center shadow-md hover:bg-rose hover:text-white transition-colors"
                  title="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
              <span className="absolute bottom-1 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-medium backdrop-blur-xs">
                Ref #{index + 1}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
