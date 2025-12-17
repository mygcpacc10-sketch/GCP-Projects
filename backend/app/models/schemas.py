"""Pydantic models for API request/response."""
from pydantic import BaseModel, Field
from typing import Optional


class UploadResponse(BaseModel):
    """Response model for PDF upload."""
    document_id: str
    filename: str
    page_count: int
    text_length: int
    message: str


class QuestionRequest(BaseModel):
    """Request model for question answering."""
    document_id: str = Field(..., description="ID of the uploaded document")
    question: str = Field(..., min_length=1, description="Question to answer")


class QuestionResponse(BaseModel):
    """Response model for question answering."""
    question: str
    answer: str
    document_id: str
    context_used: Optional[str] = None


class ErrorResponse(BaseModel):
    """Error response model."""
    detail: str
