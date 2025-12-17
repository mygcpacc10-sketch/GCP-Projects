/**
 * API service for communicating with the backend
 */
import type { UploadResponse, QuestionResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class APIError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'APIError';
  }
}

/**
 * Upload a PDF file to the backend
 */
export async function uploadPDF(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new APIError(response.status, error.detail || 'Upload failed');
  }

  return response.json();
}

/**
 * Ask a question about an uploaded document
 */
export async function askQuestion(
  documentId: string,
  question: string
): Promise<QuestionResponse> {
  const requestBody = {
    document_id: documentId,
    question: question,
  };

  const response = await fetch(`${API_URL}/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new APIError(response.status, error.detail || 'Question failed');
  }

  return response.json();
}

/**
 * Check API health
 */
export async function checkHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_URL}/health`);
  
  if (!response.ok) {
    throw new APIError(response.status, 'Health check failed');
  }
  
  return response.json();
}
