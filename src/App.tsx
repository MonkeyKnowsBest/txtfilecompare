import React, { useState, useCallback } from 'react';
import { Upload, Download, AlertCircle } from 'lucide-react';
import { FileUploader } from './components/FileUploader';
import { ResultsSection } from './components/ResultsSection';
import { findDifferences, alphabetizeWithPrefix } from './utils/comparison';

function App() {
  const [file1Words, setFile1Words] = useState<string[]>([]);
  const [file2Words, setFile2Words] = useState<string[]>([]);
  const [results, setResults] = useState<{
    onlyInFirst: string[];
    onlyInSecond: string[];
    allDifferences: string[];
  } | null>(null);

  const handleFileContent = useCallback((content: string, fileNumber: 1 | 2) => {
  // Split by newlines, trim each line, and filter for valid entries (start with $ and have content)
  const words = content
    .split('\n')
    .map(line => line.trim())
    .filter(word => word.startsWith('$') && word.length > 1);
  
  console.log(`File ${fileNumber} processed, found ${words.length} words`);

  if (fileNumber === 1) {
    setFile1Words(words);
  } else {
    setFile2Words(words);
  }
}, []);
// In App.tsx, replace the compareFiles function with this:
const compareFiles = useCallback(() => {
  if (file1Words.length === 0 || file2Words.length === 0) return;

  console.log('File 1 words:', file1Words);
  console.log('File 2 words:', file2Words);
  
  // Find differences between the two word lists
  const { onlyInFirst, onlyInSecond } = findDifferences(file1Words, file2Words);
  
  console.log('Only in first:', onlyInFirst);
  console.log('Only in second:', onlyInSecond);
  
  // Sort the results alphabetically
  const sortedFirst = alphabetizeWithPrefix(onlyInFirst);
  const sortedSecond = alphabetizeWithPrefix(onlyInSecond);
  
  // Combine both lists for "all differences" while ensuring uniqueness
  const allDifferences = alphabetizeWithPrefix([...onlyInFirst, ...onlyInSecond]);
  
  console.log('Results:', {
    onlyInFirst: sortedFirst,
    onlyInSecond: sortedSecond,
    allDifferences
  });
  
  setResults({
    onlyInFirst: sortedFirst,
    onlyInSecond: sortedSecond,
    allDifferences
  });
}, [file1Words, file2Words]);
  const downloadResults = useCallback(() => {
    if (!results) return;

    const content = `Words only in first file:\n${results.onlyInFirst.join('\n')}\n\n` +
      `Words only in second file:\n${results.onlyInSecond.join('\n')}\n\n` +
      `All differences:\n${results.allDifferences.join('\n')}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'comparison-results.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [results]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Word Comparison Tool</h1>
          <p className="text-gray-600">Compare two lists of words with $ prefixes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <FileUploader
            onFileContent={(content) => handleFileContent(content, 1)}
            label="First File"
            icon={<Upload className="w-6 h-6" />}
            fileNumber={1}
            hasContent={file1Words.length > 0}
          />
          <FileUploader
            onFileContent={(content) => handleFileContent(content, 2)}
            label="Second File"
            icon={<Upload className="w-6 h-6" />}
            fileNumber={2}
            hasContent={file2Words.length > 0}
          />
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={compareFiles}
            disabled={file1Words.length === 0 || file2Words.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Compare Files
          </button>
          {results && (
            <button
              onClick={downloadResults}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Results
            </button>
          )}
        </div>

        {!results && file1Words.length > 0 && file2Words.length > 0 && (
          <div className="flex items-center justify-center text-gray-600 gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>Click Compare Files to see the results</span>
          </div>
        )}

        {results && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ResultsSection
              title="Only in First File"
              words={results.onlyInFirst}
              className="bg-red-50"
            />
            <ResultsSection
              title="Only in Second File"
              words={results.onlyInSecond}
              className="bg-blue-50"
            />
            <ResultsSection
              title="All Differences"
              words={results.allDifferences}
              className="bg-purple-50"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
