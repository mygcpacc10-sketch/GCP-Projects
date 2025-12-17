"""Service for PDF processing and text extraction."""
import os
import uuid
from typing import Dict, Optional
from PyPDF2 import PdfReader
from pathlib import Path


class PDFService:
    """Service to handle PDF upload and text extraction."""
    
    def __init__(self, upload_dir: str = "./uploads"):
        """Initialize PDF service with upload directory."""
        self.upload_dir = Path(upload_dir)
        self.upload_dir.mkdir(parents=True, exist_ok=True)
        self.documents: Dict[str, Dict] = {}  # In-memory storage for demo
    
    async def save_and_process_pdf(self, filename: str, content: bytes) -> Dict:
        """
        Save PDF file and extract text.
        
        Args:
            filename: Original filename
            content: PDF file content as bytes
            
        Returns:
            Dict with document_id, text, page_count, and filename
        """
        # Generate unique document ID
        document_id = str(uuid.uuid4())
        
        # Save file
        file_path = self.upload_dir / f"{document_id}.pdf"
        with open(file_path, "wb") as f:
            f.write(content)
        
        # Extract text from PDF
        try:
            pdf_reader = PdfReader(file_path)
            page_count = len(pdf_reader.pages)
            
            # Extract text from all pages
            text_content = ""
            for page in pdf_reader.pages:
                text_content += page.extract_text() + "\n"
            
            # Store document metadata and text
            document_data = {
                "document_id": document_id,
                "filename": filename,
                "page_count": page_count,
                "text": text_content,
                "file_path": str(file_path)
            }
            
            self.documents[document_id] = document_data
            
            return document_data
            
        except Exception as e:
            # Clean up file on error
            if file_path.exists():
                os.remove(file_path)
            raise Exception(f"Error processing PDF: {str(e)}")
    
    def get_document(self, document_id: str) -> Optional[Dict]:
        """
        Retrieve document data by ID.
        
        Args:
            document_id: Document ID
            
        Returns:
            Document data or None if not found
        """
        return self.documents.get(document_id)
    
    def get_document_text(self, document_id: str) -> Optional[str]:
        """
        Get extracted text for a document.
        
        Args:
            document_id: Document ID
            
        Returns:
            Extracted text or None if not found
        """
        document = self.documents.get(document_id)
        return document.get("text") if document else None
