"""Service for question answering using document context."""
from typing import Optional, Dict


class QAService:
    """
    Service to handle question answering.
    
    This is a stub implementation that can be easily upgraded to use:
    - OpenAI API
    - Local LLM (e.g., Llama, Mistral)
    - RAG pipeline with vector database
    """
    
    def __init__(self):
        """Initialize QA service."""
        pass
    
    async def answer_question(
        self, 
        question: str, 
        context: str,
        document_id: str
    ) -> Dict[str, str]:
        """
        Answer a question based on the provided context.
        
        Args:
            question: User's question
            context: Document text to use as context
            document_id: ID of the source document
            
        Returns:
            Dict with answer and metadata
        """
        # Stub implementation - returns a simple response
        # TODO: Replace with actual LLM integration (OpenAI, local LLM, etc.)
        
        # Simple keyword-based stub response
        answer = self._generate_stub_answer(question, context)
        
        # Get a snippet of context used (first 200 chars)
        context_snippet = context[:200] + "..." if len(context) > 200 else context
        
        return {
            "answer": answer,
            "context_used": context_snippet,
            "document_id": document_id
        }
    
    def _generate_stub_answer(self, question: str, context: str) -> str:
        """
        Generate a stub answer based on simple heuristics.
        
        This method should be replaced with actual LLM logic.
        """
        # Check if context is empty
        if not context or not context.strip():
            return "I couldn't find any text in the document to answer your question."
        
        # Simple heuristic: check if question keywords appear in context
        question_lower = question.lower()
        context_lower = context.lower()
        
        # Extract potential keywords from question (simple approach)
        keywords = [word for word in question_lower.split() 
                   if len(word) > 3 and word not in ['what', 'when', 'where', 'which', 'whom', 'whose', 'that', 'this']]
        
        # Check if keywords appear in context
        found_keywords = [kw for kw in keywords if kw in context_lower]
        
        if found_keywords:
            # Find first sentence containing a keyword
            sentences = context.split('.')
            for sentence in sentences:
                if any(kw in sentence.lower() for kw in found_keywords):
                    return f"Based on the document: {sentence.strip()}. (Note: This is a stub response. Integrate an LLM for better answers.)"
        
        # Default response
        return (
            f"I found a document with {len(context)} characters of text. "
            f"Your question was: '{question}'. "
            f"(This is a stub response. To get intelligent answers, integrate an LLM API "
            f"like OpenAI GPT, or implement a RAG pipeline with embeddings.)"
        )
    
    # Methods for future LLM integration
    
    async def _call_openai(self, question: str, context: str) -> str:
        """
        Placeholder for OpenAI integration.
        
        Example implementation:
        ```python
        import openai
        
        response = await openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Answer questions based on the provided context."},
                {"role": "user", "content": f"Context: {context}\n\nQuestion: {question}"}
            ]
        )
        return response.choices[0].message.content
        ```
        """
        raise NotImplementedError("OpenAI integration not implemented")
    
    async def _call_local_llm(self, question: str, context: str) -> str:
        """
        Placeholder for local LLM integration (e.g., using transformers).
        
        Example implementation:
        ```python
        from transformers import pipeline
        
        qa_pipeline = pipeline("question-answering")
        result = qa_pipeline(question=question, context=context)
        return result['answer']
        ```
        """
        raise NotImplementedError("Local LLM integration not implemented")
    
    async def _call_rag_pipeline(self, question: str, document_id: str) -> str:
        """
        Placeholder for RAG (Retrieval-Augmented Generation) pipeline.
        
        Example implementation:
        ```python
        # 1. Embed the question
        # 2. Search vector database for relevant chunks
        # 3. Retrieve top-k relevant passages
        # 4. Generate answer using LLM with retrieved context
        ```
        """
        raise NotImplementedError("RAG pipeline not implemented")
