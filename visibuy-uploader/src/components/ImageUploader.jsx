import React, { useState, useRef, useEffect } from "react";

export default function ImageUploader({ maxFiles = 5 }) {
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef();

  // cleanup previews when component unmounts
  useEffect(() => {
    return () => images.forEach(img => URL.revokeObjectURL(img.preview));
  }, [images]);

  // handle selecting files
  const handleSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    const valid = selected.filter(f =>
      ["image/jpeg", "image/jpg", "image/png"].includes(f.type)
    );

    if (images.length >= maxFiles) {
      setError(`You can only upload ${maxFiles} images.`);
      return;
    }

    if (images.length + valid.length > maxFiles) {
      setError(`Maximum of ${maxFiles} images allowed.`);
      const remaining = maxFiles - images.length;
      addImages(valid.slice(0, remaining));
    } else {
      addImages(valid);
      setError("");
    }

    e.target.value = "";
  };

  const addImages = (files) => {
    const newImages = files.map(f => ({
      file: f,
      preview: URL.createObjectURL(f),
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    const toRemove = images[index];
    if (toRemove) URL.revokeObjectURL(toRemove.preview);
    setImages(images.filter((_, i) => i !== index));
  };

  const handleUploadClick = () => inputRef.current?.click();

  const handleSubmit = () => {
    if (images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }

    setLoading(true);
    setProgress(0);

    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            console.log("Submitted files:", images.map(i => i.file));
            alert("Upload complete!");
            setImages([]);
            setLoading(false);
            setProgress(0);
          }, 300);
        }
        return Math.min(p + 10, 100);
      });
    }, 200);
  };

  return (
    <div className="uploader">
      <div className="controls">
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/png, image/jpeg"
          onChange={handleSelect}
          style={{ display: "none" }}
        />
        <button className="btn" onClick={handleUploadClick} disabled={loading}>
          Upload Images
        </button>
        <button className="btn primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
        <span className="status">{images.length} / {maxFiles}</span>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="preview-grid">
        {images.map((img, i) => (
          <div className="preview-card" key={i}>
            <img src={img.preview} alt={`upload-${i}`} />
            <div className="preview-actions">
              <button className="small" onClick={() => removeImage(i)} disabled={loading}>
                Delete
              </button>
              <span className="file-name">{img.file.name}</span>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="progress-wrap">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
          <div className="progress-text">Uploading... {progress}%</div>
        </div>
      )}
    </div>
  );
}
