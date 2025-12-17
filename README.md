# AI-Driven PDF Question Answering Application

A modern full-stack application for uploading PDF documents and asking questions about their content using AI.

## 🏗️ Project Structure

```
.
├── backend/                    # Python FastAPI backend
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── __init__.py
│   │   │   └── routes.py      # PDF upload and Q&A endpoints
│   │   ├── models/            # Pydantic models
│   │   │   ├── __init__.py
│   │   │   └── schemas.py     # Request/response schemas
│   │   ├── services/          # Business logic
│   │   │   ├── __init__.py
│   │   │   ├── pdf_service.py # PDF processing and text extraction
│   │   │   └── qa_service.py  # Question answering (stub)
│   │   ├── __init__.py
│   │   ├── config.py          # Configuration management
│   │   └── main.py            # FastAPI application entry point
│   ├── uploads/               # Uploaded PDF storage (gitignored)
│   ├── .dockerignore
│   ├── .env.example           # Example environment variables
│   ├── Dockerfile
│   └── requirements.txt       # Python dependencies
├── frontend/                  # React TypeScript frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── PDFUpload.tsx  # PDF upload component
│   │   │   └── ChatInterface.tsx # Chat UI for Q&A
│   │   ├── services/          # API communication
│   │   │   └── api.ts         # Backend API calls
│   │   ├── types/             # TypeScript type definitions
│   │   │   └── index.ts
│   │   ├── App.tsx            # Main application component
│   │   ├── App.css            # Application styles
│   │   └── main.tsx           # React entry point
│   ├── .dockerignore
│   ├── .env.example           # Example environment variables
│   ├── Dockerfile
│   ├── nginx.conf             # Nginx configuration for production
│   └── package.json           # Node.js dependencies
├── docker-compose.yml         # Docker Compose for local development
├── .gitignore
└── README.md
```

## ✨ Features

- **PDF Upload**: Upload PDF files up to 10MB
- **Text Extraction**: Automatic text extraction from uploaded PDFs using PyPDF2
- **Question Answering**: Ask questions about the uploaded document content
- **Chat Interface**: Modern chat-style UI for natural interaction
- **Modular Architecture**: Easy to upgrade with real LLM or RAG implementations
- **Docker Support**: Complete Docker setup for easy deployment

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose (recommended)
- OR: Python 3.11+, Node.js 18+ (for local development)

### Option 1: Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/mygcpacc10-sketch/GCP-Projects.git
cd GCP-Projects
```

2. Start the application:
```bash
docker-compose up --build
```

3. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Option 2: Local Development

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

5. Run the backend:
```bash
python -m app.main
# OR
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Run the frontend:
```bash
npm run dev
```

5. Access the application:
   - Frontend: http://localhost:5173

## 📝 Usage

1. **Upload a PDF**: Click "Choose File" and select a PDF document, then click "Upload PDF"
2. **View Document Info**: After upload, see document metadata (pages, text length, etc.)
3. **Ask Questions**: Type your question in the chat input and click "Send"
4. **Review Answers**: The AI assistant will respond based on the document content

## 🔧 Configuration

### Backend (.env)

```env
HOST=0.0.0.0
PORT=8000
DEBUG=True
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
MAX_UPLOAD_SIZE=10485760  # 10MB
UPLOAD_DIR=./uploads
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000/api
```

## 🧩 API Endpoints

### Upload PDF
- **POST** `/api/upload`
- **Body**: FormData with PDF file
- **Response**: Document ID, filename, page count, text length

### Ask Question
- **POST** `/api/ask`
- **Body**: `{ "document_id": "string", "question": "string" }`
- **Response**: Question, answer, document ID, context used

### Health Check
- **GET** `/api/health`
- **Response**: `{ "status": "healthy" }`

## 🔮 Future Enhancements

The current implementation uses stub responses for question answering. To integrate real AI capabilities:

### Option 1: OpenAI Integration
```python
# In qa_service.py
import openai

async def answer_question(self, question: str, context: str):
    response = await openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Answer based on context."},
            {"role": "user", "content": f"Context: {context}\n\nQ: {question}"}
        ]
    )
    return response.choices[0].message.content
```

### Option 2: Local LLM (Transformers)
```python
from transformers import pipeline

qa_pipeline = pipeline("question-answering")
result = qa_pipeline(question=question, context=context)
```

### Option 3: RAG Pipeline
1. Add vector database (Pinecone, Weaviate, ChromaDB)
2. Embed document chunks
3. Retrieve relevant passages
4. Generate answers with LLM

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **PyPDF2**: PDF text extraction
- **Pydantic**: Data validation
- **Uvicorn**: ASGI server

### Frontend
- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool
- **CSS3**: Modern styling

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Nginx**: Production web server

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🐛 Known Limitations

- **Stub Responses**: Current Q&A uses simple heuristics, not real AI
- **In-Memory Storage**: Documents stored in memory (resets on restart)
- **No Authentication**: No user authentication implemented
- **Single User**: Not designed for concurrent users
- **File Size Limit**: 10MB maximum PDF size

## 🎯 Next Steps

1. Integrate OpenAI API or local LLM
2. Add vector database for RAG
3. Implement user authentication
4. Add persistent storage (PostgreSQL, MongoDB)
5. Support multiple file formats
6. Add document management features
7. Implement conversation history
8. Add streaming responses