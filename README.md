# Document Summary Assistant

A web application that allows users to upload documents (.pdf, .jpg, .png) and get summaries.

## Project Structure

- **frontend/** - React UI for document uploads and display
- **backend/** - Express API for text extraction and summaries

## Features

- Drag-and-drop file upload interface
- File type restrictions (.pdf, .jpg, .png)
- Display of uploaded file name and size
- Backend API for document processing
- File storage and retrieval system
- PDF text extraction
- Text display interface

## Setup Instructions

### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```
   The backend server will run on port 5000.

### Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```
   The frontend will run on port 3000.

## Technologies Used

- **Frontend**: React, TailwindCSS
- **Backend**: Express.js, Multer (for file uploads)

## API Documentation

### File Upload

- **Endpoint**: `POST /api/upload`
- **Description**: Upload a document file (.pdf, .jpg, .png)
- **Request**: Multipart form data with field name `document`
- **Response**: JSON object with file information
  ```json
  {
    "success": true,
    "message": "File uploaded successfully",
    "filename": "1693163012345-document.pdf",
    "originalName": "document.pdf",
    "mimetype": "application/pdf",
    "size": 12345,
    "path": "uploads/1693163012345-document.pdf",
    "url": "/uploads/1693163012345-document.pdf"
  }
  ```

### List Files

- **Endpoint**: `GET /api/files`
- **Description**: Get a list of all uploaded files
- **Response**: JSON array of file objects
  ```json
  {
    "success": true,
    "files": [
      {
        "filename": "1693163012345-document.pdf",
        "path": "uploads/1693163012345-document.pdf",
        "url": "/uploads/1693163012345-document.pdf",
        "size": 12345,
        "createdAt": "2025-08-27T18:30:12.345Z"
      }
    ]
  }
  ```

### Get File Information

- **Endpoint**: `GET /api/files/:filename`
- **Description**: Get information about a specific file
- **Response**: JSON object with file details
  ```json
  {
    "success": true,
    "file": {
      "filename": "1693163012345-document.pdf",
      "path": "uploads/1693163012345-document.pdf",
      "url": "/uploads/1693163012345-document.pdf",
      "size": 12345,
      "createdAt": "2025-08-27T18:30:12.345Z"
    }
  }
  ```

### Extract Text from File

- **Endpoint**: `GET /api/extract/:filename`
- **Description**: Extract text from an uploaded document (currently supports PDF)
- **Response**: JSON object with extracted text and metadata
  ```json
  {
    "success": true,
    "filename": "1693163012345-document.pdf",
    "extraction": {
      "text": "Extracted content from the document...",
      "numPages": 5,
      "info": {
        "Author": "Document Author",
        "CreationDate": "D:20250827183012+00'00'",
        "Creator": "Application Name",
        "Keywords": "sample, document, pdf",
        "ModDate": "D:20250827183012+00'00'",
        "Subject": "Document Subject",
        "Title": "Document Title"
      }
    }
  }
  ```
