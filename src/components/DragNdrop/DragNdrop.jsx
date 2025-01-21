import React, { useEffect, useState, useCallback, useRef } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdClear } from "react-icons/md";
import "../../assets/stylesheet.css";

// Custom debounce function (Alternative to Lodash)
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const DragNdrop = ({ onFilesSelected, width, height }) => {
  const [files, setFiles] = useState([]);
  const filesRef = useRef([]);

  // Debounced function to update parent component
  const debouncedOnFilesSelected = useCallback(
    debounce((selectedFiles) => {
      if (typeof onFilesSelected === "function") {
        onFilesSelected(selectedFiles);
      }
    }, 300), // Debounce delay
    []
  );

  const updateFiles = (newFiles) => {
    filesRef.current = [...filesRef.current, ...newFiles];
    setFiles([...filesRef.current]);
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    updateFiles(selectedFiles);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    updateFiles(droppedFiles);
  };

  const handleRemoveFile = (index) => {
    filesRef.current = filesRef.current.filter((_, i) => i !== index);
    setFiles([...filesRef.current]);
  };

  useEffect(() => {
    debouncedOnFilesSelected(files);
  }, [files, debouncedOnFilesSelected]);

  return (
    <section className="drag-drop" style={{ width, height }}>
      <div
        className={`document-uploader ${files.length > 0 ? "upload-box active" : "upload-box"}`}
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        <div className="upload-info">
          <AiOutlineCloudUpload />
          <div>
            <p>Drag and drop your files here</p>
            <p>Limit 15MB per file. Supported files: PDF, TXT, JPG, PNG</p>
          </div>
        </div>
        <input
          type="file"
          hidden
          id="browse"
          onChange={handleFileChange}
          accept=".pdf,.txt,.jpg,.jpeg,.png"
          multiple
        />
        <label htmlFor="browse" className="browse-btn">Browse files</label>

        {files.length > 0 && (
          <div className="file-list" style={{ maxHeight: "190px", overflowY: "auto" }}>
            <div className="file-list__container">
              {files.map((file, index) => (
                <div className="file-item" key={index}>
                  <div className="file-info">
                    <p>{file.name}</p>
                  </div>
                  <div className="file-actions">
                    <MdClear onClick={() => handleRemoveFile(index)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default React.memo(DragNdrop);
