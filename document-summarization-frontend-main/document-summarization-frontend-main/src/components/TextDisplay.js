import React from 'react';

const TextDisplay = ({ extractedText, isLoading, error }) => {
  return (
    <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Extracted Text</h2>
      
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Extracting text...</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}
      
      {!isLoading && !error && extractedText && (
        <div>
          <div className="mb-4 flex items-center">
            <span className="text-gray-700 font-medium mr-2">Pages:</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
              {extractedText.numPages || 'N/A'}
            </span>
          </div>
          
          <div className="border rounded-md p-4 bg-gray-50 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
              {extractedText.text || 'No text could be extracted.'}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextDisplay;
