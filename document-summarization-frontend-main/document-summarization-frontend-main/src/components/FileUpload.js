import React, { useState, useRef } from 'react';
import TextDisplay from './TextDisplay';
import SummaryDisplay from './SummaryDisplay';
import config from '../config';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedText, setExtractedText] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState('');
  const [summaryLength, setSummaryLength] = useState('medium');
  const [summary, setSummary] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState('');
  const fileInputRef = useRef(null);

  const allowedFileTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  const allowedFileExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    handleFileValidation(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFileValidation(selectedFile);
  };

  const handleFileValidation = (selectedFile) => {
    if (!selectedFile) return;

    const fileExtension = '.' + selectedFile.name.split('.').pop().toLowerCase();
    
    if (!allowedFileTypes.includes(selectedFile.type) || 
        !allowedFileExtensions.includes(fileExtension)) {
      setUploadStatus('Error: Only PDF, JPG, and PNG files are allowed.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setUploadStatus(`File selected: ${selectedFile.name}`);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus('Please select a file first.');
      return;
    }

    setUploadStatus('Processing...');
    setIsExtracting(true);
    setExtractionError('');
    setExtractedText(null);

    const formData = new FormData();
    formData.append('document', file);

    try {
      const response = await fetch(`${config.apiUrl}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadStatus(`File processed successfully: ${file.name}`);
        setUploadedFile(data);
        
        // Set extracted text if available
        if (data.extraction) {
          setExtractedText(data.extraction);
        }
      } else {
        setUploadStatus(`Error: ${data.error || 'Processing failed'}`);
        setExtractionError(data.error || 'Processing failed');
      }
    } catch (error) {
      setUploadStatus(`Error: ${error.message}`);
      setExtractionError(error.message);
    } finally {
      setIsExtracting(false);
    }
  };

  const openFileSelector = () => {
    fileInputRef.current.click();
  };

  // Handle summary generation
  const handleGenerateSummary = async () => {
    if (!extractedText || !extractedText.text) {
      setSummaryError('No text available to summarize');
      return;
    }

    setIsSummarizing(true);
    setSummaryError('');
    setSummary(null);

    try {
      const response = await fetch(`${config.apiUrl}/api/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: extractedText.text,
          length: summaryLength
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSummary(data.summary);
      } else {
        setSummaryError(`Error: ${data.error || 'Failed to generate summary'}`);
      }
    } catch (error) {
      setSummaryError(`Error: ${error.message}`);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileSelector}
      >
        <input 
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        <div className="flex flex-col items-center justify-center">
          <svg 
            className="w-12 h-12 text-gray-400 mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-lg font-medium text-gray-700">
            Drag & drop your file here, or click to select
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Supported formats: PDF, JPG, PNG
          </p>
        </div>
      </div>

      {file && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg 
                className="w-8 h-8 text-gray-500 mr-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div>
                <p className="font-medium text-gray-800">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setUploadStatus('');
              }}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      <div className="mt-4">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleUpload();
          }}
          disabled={!file}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            file ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Upload Document
        </button>
      </div>

      {uploadStatus && (
        <div className={`mt-4 p-3 rounded-md ${
          uploadStatus.includes('Error') 
            ? 'bg-red-100 text-red-700' 
            : uploadStatus.includes('successfully')
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-100 text-blue-700'
        }`}>
          {uploadStatus}
        </div>
      )}
      
      {/* Text extraction happens automatically during upload */}
      
      {(extractedText || isExtracting || extractionError) && (
        <TextDisplay 
          extractedText={extractedText} 
          isLoading={isExtracting} 
          error={extractionError} 
        />
      )}
      
      {extractedText && !isExtracting && !extractionError && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Generate Summary</h3>
          <div className="flex items-center mb-4">
            <span className="mr-3 text-gray-700">Summary Length:</span>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600"
                  name="summaryLength"
                  value="short"
                  checked={summaryLength === 'short'}
                  onChange={() => setSummaryLength('short')}
                />
                <span className="ml-2">Short</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600"
                  name="summaryLength"
                  value="medium"
                  checked={summaryLength === 'medium'}
                  onChange={() => setSummaryLength('medium')}
                />
                <span className="ml-2">Medium</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600"
                  name="summaryLength"
                  value="long"
                  checked={summaryLength === 'long'}
                  onChange={() => setSummaryLength('long')}
                />
                <span className="ml-2">Long</span>
              </label>
            </div>
          </div>
          <button
            onClick={handleGenerateSummary}
            disabled={isSummarizing}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isSummarizing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isSummarizing ? 'Generating...' : 'Generate Summary'}
          </button>
        </div>
      )}
      
      {(summary || isSummarizing || summaryError) && (
        <SummaryDisplay
          summary={summary}
          isLoading={isSummarizing}
          error={summaryError}
        />
      )}
    </div>
  );
};

export default FileUpload;
