/**
 * Component for uploading PDF files
 */
import { useState } from 'react';
import { uploadPDF } from '../services/api';
import type { UploadResponse } from '../types';

interface PDFUploadProps {
  onUploadSuccess: (response: UploadResponse) => void;
}

export default function PDFUpload({ onUploadSuccess }: PDFUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please select a PDF file');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const response = await uploadPDF(selectedFile);
      onUploadSuccess(response);
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="pdf-upload">
      <h2>Upload PDF Document</h2>
      <div className="upload-container">
        <input
          id="file-input"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={uploading}
          className="file-input"
        />
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="upload-button"
        >
          {uploading ? 'Uploading...' : 'Upload PDF'}
        </button>
      </div>
      {selectedFile && (
        <p className="file-info">Selected: {selectedFile.name}</p>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
