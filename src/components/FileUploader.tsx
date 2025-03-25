import React, { useCallback } from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface FileUploaderProps {
  onFileContent: (content: string) => void;
  label: string;
  icon: React.ReactNode;
  fileNumber: number;
  hasContent: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileContent,
  label,
  icon,
  fileNumber,
  hasContent,
}) => {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          onFileContent(content);
        };
        reader.readAsText(file);
      }
    },
    [onFileContent]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          onFileContent(content);
        };
        reader.readAsText(file);
      }
    },
    [onFileContent]
  );

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors
        ${hasContent ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-gray-400'}
      `}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id={`file-${fileNumber}`}
        className="hidden"
        onChange={handleFileInput}
        accept=".txt"
      />
      <label
        htmlFor={`file-${fileNumber}`}
        className="cursor-pointer block"
      >
        <div className="flex justify-center mb-2">{icon}</div>
        <div className="text-lg font-medium text-gray-700 mb-1">{label}</div>
        <p className="text-sm text-gray-500">
          {hasContent ? 'File loaded ✓' : 'Drop a text file here or click to browse'}
        </p>
      </label>
    </div>
  );
};