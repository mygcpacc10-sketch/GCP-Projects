/**
 * Main application component
 */
import { useState } from 'react';
import PDFUpload from './components/PDFUpload';
import ChatInterface from './components/ChatInterface';
import { UploadResponse } from './types';
import './App.css';

function App() {
  const [uploadedDocument, setUploadedDocument] = useState<UploadResponse | null>(null);

  const handleUploadSuccess = (response: UploadResponse) => {
    setUploadedDocument(response);
  };

  const handleReset = () => {
    setUploadedDocument(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>AI-Driven PDF Question Answering</h1>
        <p className="subtitle">Upload a PDF and ask questions about its content</p>
      </header>

      <main className="app-main">
        <div className="upload-section">
          <PDFUpload onUploadSuccess={handleUploadSuccess} />
          
          {uploadedDocument && (
            <div className="upload-success">
              <h3>✓ Document Uploaded Successfully</h3>
              <div className="document-details">
                <p><strong>Filename:</strong> {uploadedDocument.filename}</p>
                <p><strong>Pages:</strong> {uploadedDocument.page_count}</p>
                <p><strong>Text Length:</strong> {uploadedDocument.text_length} characters</p>
                <p><strong>Document ID:</strong> {uploadedDocument.document_id}</p>
              </div>
              <button onClick={handleReset} className="reset-button">
                Upload Another Document
              </button>
            </div>
          )}
        </div>

        <div className="chat-section">
          <ChatInterface
            documentId={uploadedDocument?.document_id || null}
            documentName={uploadedDocument?.filename || null}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>Note: This is a demonstration with stub LLM responses. Integrate a real LLM for intelligent answers.</p>
      </footer>
    </div>
  );
}

export default App;
