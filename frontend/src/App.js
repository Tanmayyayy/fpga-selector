import React, { useState, useEffect } from 'react';
import { Moon, Sun, Cpu, FileText, Upload, Code, BarChart3 } from 'lucide-react';
import CodeEditor from './components/CodeEditor';
import FileUpload from './components/FileUpload';
import AnalysisResults from './components/AnalysisResults';
import BoardRecommendations from './components/BoardRecommendations';
import LoadingSpinner from './components/LoadingSpinner';
import { analyzeCode, askLLM } from './utils/api';
import AIAssistant from './components/AIAssistant';
 

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [code, setCode] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' or 'upload'

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      setDarkMode(JSON.parse(savedTheme));
    } else {
      // Default to system preference
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError('Please enter some Verilog code to analyze.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeCode(code);
      setAnalysisResult(result);
    } catch (err) {
      setError(err.message || 'Analysis failed. Please check your code and try again.');
      setAnalysisResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (fileContent) => {
    setCode(fileContent);
    setActiveTab('editor');
    setError(null);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    setError(null);
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <header className="glass-effect border-b border-blue-200/30 dark:border-gray-700/50 sticky top-0 z-50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg">
                <Cpu className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text">
                FPGA Selector
              </h1>
            </div>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 shadow-sm transition-all duration-200 border border-gray-200/50 dark:border-gray-700/50"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-amber-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Verilog Code Input
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('editor')}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      activeTab === 'editor'
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    <Code className="h-4 w-4" />
                    <span>Editor</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      activeTab === 'upload'
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                  </button>
                </div>
              </div>

              {activeTab === 'editor' ? (
                <CodeEditor
                  value={code}
                  onChange={handleCodeChange}
                  placeholder="Enter your Verilog code here..."
                />
              ) : (
                <FileUpload onFileUpload={handleFileUpload} />
              )}

              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={resetAnalysis}
                  className="btn-secondary"
                  disabled={!analysisResult}
                >
                  Reset
                </button>
                
                <button
                  onClick={handleAnalyze}
                  disabled={!code.trim() || isLoading}
                  className="btn-primary flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <BarChart3 className="h-4 w-4" />
                      <span>Analyze Code</span>
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm status-error">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {isLoading && (
              <div className="card p-6">
                <div className="flex items-center justify-center space-x-3">
                  <LoadingSpinner />
                  <span className="text-gray-600 dark:text-gray-400">
                    Analyzing your Verilog code...
                  </span>
                </div>
              </div>
            )}

            {analysisResult && (
              <>
                <AnalysisResults result={analysisResult.analysis} />
                <BoardRecommendations recommendations={analysisResult.recommendations} />
                <AIAssistant
                  code={code}
                  analysis={analysisResult.analysis}
                  recommendations={analysisResult.recommendations}
                  onAsk={askLLM}
                />
                 
              </>
            )}

            {!isLoading && !analysisResult && (
              <div className="card p-6">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No Analysis Yet</h3>
                  <p className="text-sm">
                    Enter your Verilog code and click "Analyze Code" to get started.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 mt-8 border-t border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text">
              VIT Chennai
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              All rights reserved © 2025
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App; 
