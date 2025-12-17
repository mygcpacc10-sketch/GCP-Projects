/**
 * Type definitions for the application
 */

export interface UploadResponse {
  document_id: string;
  filename: string;
  page_count: number;
  text_length: number;
  message: string;
}

export interface QuestionRequest {
  document_id: string;
  question: string;
}

export interface QuestionResponse {
  question: string;
  answer: string;
  document_id: string;
  context_used?: string;
}

export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ErrorResponse {
  detail: string;
}
