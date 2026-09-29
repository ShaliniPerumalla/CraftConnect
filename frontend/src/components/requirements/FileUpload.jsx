// src/components/requirements/FileUpload.jsx

import { useState } from "react";
import { Upload, X, ImagePlus, Sparkles } from "lucide-react";

export default function FileUpload({
  images = [],
  onChange,
  maxFiles = 5,
  maxSizeMb = 5,
}) {
  const [dragActive, setDragActive] = useState(false);

  const sampleImages = [
    {
      name: "Resin Nameplate Sample",
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Wood Art Sample",
      url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Ceramic Sample",
      url: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const handleFiles = (fileList) => {
    const validFiles = [];
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (!validTypes.includes(file.type)) {
        alert(`${file.name} is not an accepted image format (JPG, PNG, WEBP).`);
        continue;
      }
      if (file.size > maxSizeMb * 1024 * 1024) {
        alert(`${file.name} exceeds the ${maxSizeMb}MB size limit.`);
        continue;
      }

      // Convert to object preview URL
      const previewUrl = URL.createObjectURL(file);
      validFiles.push(previewUrl);
    }

    if (validFiles.length > 0) {
      const combined = [...images, ...validFiles].slice(0, maxFiles);
      onChange(combined);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const removeImage = (indexToRemove) => {
    const filtered = images.filter((_, idx) => idx !== indexToRemove);
    onChange(filtered);
  };

  const addSampleImage = (url) => {
    if (images.includes(url)) return;
    if (images.length >= maxFiles) {
      alert(`Maximum of ${maxFiles} reference images allowed.`);
      return;
    }
    onChange([...images, url]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-ink">
          Upload Reference Images
        </label>
        <span className="text-xs text-ink-muted">
          {images.length}/{maxFiles} uploaded
        </span>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative
          rounded-2xl
          border-2
          border-dashed
          transition-all
          p-6
          text-center
          ${
            dragActive
              ? "border-amber bg-amber/5 scale-[0.99]"
              : "border-border bg-gradient-to-b from-cream/40 to-white hover:border-amber/60"
          }
        `}
      >
        <input
          type="file"
          id="reference-images-input"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileInput}
          className="hidden"
          disabled={images.length >= maxFiles}
        />

        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-white border border-border shadow-sm flex items-center justify-center text-amber-dark mb-3">
            <ImagePlus size={22} />
          </div>

          <p className="text-sm font-medium text-ink">
            Drag & drop reference images here, or{" "}
            <label
              htmlFor="reference-images-input"
              className="text-amber-dark hover:underline cursor-pointer font-semibold"
            >
              browse
            </label>
          </p>

          <p className="text-xs text-ink-muted mt-1">
            Supports JPG, PNG, WEBP (Max {maxSizeMb}MB each, up to {maxFiles} images)
          </p>
        </div>
      </div>

      {/* Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
          {images.map((imgUrl, idx) => (
            <div
              key={idx}
              className="relative group rounded-xl overflow-hidden aspect-square border border-border bg-cream shadow-sm"
            >
              <img
                src={imgUrl}
                alt={`Reference ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="
                  absolute
                  top-2
                  right-2
                  w-7
                  h-7
                  rounded-full
                  bg-black/70
                  hover:bg-rose
                  text-white
                  flex
                  items-center
                  justify-center
                  transition-colors
                  shadow-md
                "
                title="Remove image"
              >
                <X size={14} />
              </button>
              <span className="absolute bottom-1.5 left-2 text-[10px] font-semibold bg-black/60 text-white px-1.5 py-0.5 rounded">
                Ref #{idx + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Sample Reference Inspiration */}
      {images.length < maxFiles && (
        <div className="pt-2">
          <p className="text-xs text-ink-muted flex items-center gap-1 mb-2">
            <Sparkles size={13} className="text-amber-dark" />
            Or pick from reference inspiration:
          </p>
          <div className="flex flex-wrap gap-2">
            {sampleImages.map((sample, i) => (
              <button
                key={i}
                type="button"
                onClick={() => addSampleImage(sample.url)}
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  text-xs
                  bg-white
                  border
                  border-border
                  hover:border-amber
                  px-2.5
                  py-1.5
                  rounded-lg
                  text-ink-soft
                  hover:text-ink
                  transition-all
                "
              >
                <span>+</span>
                <span>{sample.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
