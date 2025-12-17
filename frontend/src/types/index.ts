/**
 * Type definitions for the application
 */

export type UploadResponse = {
  document_id: string;
  filename: string;
  page_count: number;
  text_length: number;
  message: string;
};

export type QuestionRequest = {
  document_id: string;
  question: string;
};

export type QuestionResponse = {
  question: string;
  answer: string;
  document_id: string;
  context_used?: string;
};

export type Message = {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export type ErrorResponse = {
  detail: string;
};
