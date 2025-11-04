import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const FileUpload = ({ onFileUpload }) => {
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null
  const [uploadMessage, setUploadMessage] = useState('');

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Clear any previous status
    setUploadStatus(null);
    setUploadMessage('');

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      setUploadStatus('error');
      if (error.code === 'file-invalid-type') {
        setUploadMessage('Please select a Verilog (.v) file.');
      } else {
        setUploadMessage('Invalid file. Please try again.');
      }
      return;
    }

    const file = acceptedFiles[0];
    if (!file) {
      setUploadStatus('error');
      setUploadMessage('No file selected.');
      return;
    }

    // Additional validation for file extension and size
    if (!file.name.toLowerCase().endsWith('.v')) {
      setUploadStatus('error');
      setUploadMessage('Please select a Verilog (.v) file.');
      return;
    }

    if (file.size === 0) {
      setUploadStatus('error');
      setUploadMessage('The file is empty.');
      return;
    }

    if (file.size > 1024 * 1024) { // 1MB limit
      setUploadStatus('error');
      setUploadMessage('File size too large. Please keep it under 1MB.');
      return;
    }

    // Read file content
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        onFileUpload(content);
        setUploadStatus('success');
        setUploadMessage(`Successfully loaded ${file.name}`);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setUploadStatus(null);
          setUploadMessage('');
        }, 3000);
      } catch (error) {
        setUploadStatus('error');
        setUploadMessage('Error reading file. Please try again.');
      }
    };

    reader.onerror = () => {
      setUploadStatus('error');
      setUploadMessage('Error reading file. Please try again.');
    };

    reader.readAsText(file);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.v',
    multiple: false,
    maxFiles: 1
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 ${
          isDragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            {isDragActive ? (
              <Upload className="h-12 w-12 text-primary-500 animate-pulse" />
            ) : (
              <FileText className="h-12 w-12 text-gray-400" />
            )}
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {isDragActive ? 'Drop your Verilog file here' : 'Drag & drop a .v file here'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              or click to browse files
            </p>
          </div>
          
          <div className="text-xs text-gray-400 dark:text-gray-500">
            Only .v files are supported
          </div>
        </div>
      </div>

      {uploadStatus && (
        <div className={`flex items-center space-x-2 p-3 rounded-lg ${
          uploadStatus === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}>
          {uploadStatus === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
          <span className={`text-sm ${
            uploadStatus === 'success' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
          }`}>
            {uploadMessage}
          </span>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 