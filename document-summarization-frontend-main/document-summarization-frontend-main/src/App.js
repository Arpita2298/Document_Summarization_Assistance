import './App.css';
import './styles/markdown.css';
import FileUpload from './components/FileUpload';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Document Summary Assistant</h1>
          <p className="text-xl text-gray-600">
            Upload your documents for quick and accurate summaries
          </p>
        </header>
        
        <main>
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Upload Document</h2>
            <FileUpload />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
