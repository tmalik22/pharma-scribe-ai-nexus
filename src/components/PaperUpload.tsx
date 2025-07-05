
import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  aiTags?: string[];
}

const PaperUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    files.forEach(file => {
      if (file.type === 'application/pdf') {
        const newFile: UploadedFile = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          status: 'uploading',
          progress: 0
        };

        setUploadedFiles(prev => [...prev, newFile]);

        // Simulate upload process
        simulateUpload(newFile.id);
      }
    });
  };

  const simulateUpload = (fileId: string) => {
    const intervals = [
      { delay: 500, progress: 30, status: 'uploading' as const },
      { delay: 1000, progress: 60, status: 'uploading' as const },
      { delay: 1500, progress: 90, status: 'processing' as const },
      { delay: 2500, progress: 100, status: 'completed' as const, tags: ['Oncology', 'Clinical Trial', 'Drug Efficacy'] }
    ];

    intervals.forEach(({ delay, progress, status, tags }) => {
      setTimeout(() => {
        setUploadedFiles(prev => prev.map(file => 
          file.id === fileId 
            ? { ...file, progress, status, aiTags: tags }
            : file
        ));
      }, delay);
    });
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="animate-spin text-blue-500" size={20} />;
      case 'completed':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'error':
        return <AlertCircle className="text-red-500" size={20} />;
    }
  };

  const getStatusText = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'AI Processing...';
      case 'completed':
        return 'Complete';
      case 'error':
        return 'Error';
    }
  };

  return (
    <div className="p-6 bg-gray-50 h-full">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Research Papers</h2>
          <p className="text-gray-600">Upload PDF files to add them to your research database</p>
        </div>

        {/* Upload Area */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-semibold mb-2">Drop PDF files here</h3>
              <p className="text-gray-600 mb-4">or click to browse files</p>
              <Button
                onClick={() => document.getElementById('file-input')?.click()}
                className="mb-4"
              >
                Select Files
              </Button>
              <input
                id="file-input"
                type="file"
                multiple
                accept=".pdf"
                className="hidden"
                onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
              />
              <p className="text-sm text-gray-500">
                Supported format: PDF • Max file size: 50MB each
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Upload Progress */}
        {uploadedFiles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Upload Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {uploadedFiles.map(file => (
                  <div key={file.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <FileText className="text-gray-400" size={20} />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-gray-500">{file.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(file.status)}
                        <span className="text-sm font-medium">
                          {getStatusText(file.status)}
                        </span>
                      </div>
                    </div>
                    
                    <Progress value={file.progress} className="mb-3" />
                    
                    {file.aiTags && (
                      <div className="flex flex-wrap gap-2">
                        <span className="text-sm text-gray-600 mr-2">AI Tags:</span>
                        {file.aiTags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 mb-2">AI Processing Features</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Automatic text extraction and indexing</li>
              <li>• AI-powered tagging and categorization</li>
              <li>• Abstract and key findings summarization</li>
              <li>• Author and citation network analysis</li>
              <li>• Full-text search capability</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaperUpload;
