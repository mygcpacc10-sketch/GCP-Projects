"""API routes for PDF upload and question answering."""
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.models.schemas import (
    UploadResponse, 
    QuestionRequest, 
    QuestionResponse,
    ErrorResponse
)
from app.services.pdf_service import PDFService
from app.services.qa_service import QAService
from app.config import settings


router = APIRouter()

# Initialize services
pdf_service = PDFService(upload_dir=settings.upload_dir)
qa_service = QAService()


@router.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "AI-Driven PDF Question Answering API",
        "version": "1.0.0",
        "endpoints": {
            "upload": "/api/upload",
            "ask": "/api/ask"
        }
    }


@router.post(
    "/upload",
    response_model=UploadResponse,
    responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}}
)
async def upload_pdf(file: UploadFile = File(...)):
    """
    Upload a PDF file and extract text.
    
    Args:
        file: PDF file to upload
        
    Returns:
        UploadResponse with document ID and metadata
    """
    # Validate file type
    if not file.filename or not file.filename.endswith('.pdf'):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported"
        )
    
    # Validate file size
    content = await file.read()
    if len(content) > settings.max_upload_size:
        raise HTTPException(
            status_code=400,
            detail=f"File size exceeds maximum allowed size of {settings.max_upload_size} bytes"
        )
    
    try:
        # Process PDF
        document_data = await pdf_service.save_and_process_pdf(
            filename=file.filename,
            content=content
        )
        
        return UploadResponse(
            document_id=document_data["document_id"],
            filename=document_data["filename"],
            page_count=document_data["page_count"],
            text_length=len(document_data["text"]),
            message="PDF uploaded and processed successfully"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing PDF: {str(e)}"
        )


@router.post(
    "/ask",
    response_model=QuestionResponse,
    responses={404: {"model": ErrorResponse}, 500: {"model": ErrorResponse}}
)
async def ask_question(request: QuestionRequest):
    """
    Answer a question based on uploaded document.
    
    Args:
        request: Question request with document_id and question
        
    Returns:
        QuestionResponse with answer
    """
    # Get document text
    document_text = pdf_service.get_document_text(request.document_id)
    
    if not document_text:
        raise HTTPException(
            status_code=404,
            detail=f"Document with ID {request.document_id} not found"
        )
    
    try:
        # Get answer from QA service
        result = await qa_service.answer_question(
            question=request.question,
            context=document_text,
            document_id=request.document_id
        )
        
        return QuestionResponse(
            question=request.question,
            answer=result["answer"],
            document_id=result["document_id"],
            context_used=result.get("context_used")
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating answer: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
