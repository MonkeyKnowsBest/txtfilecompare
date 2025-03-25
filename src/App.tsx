import React, { useState, useCallback } from 'react';
import { Upload, Download, AlertCircle } from 'lucide-react';
import { FileUploader } from './components/FileUploader';
import { ResultsSection } from './components/ResultsSection';

// Utility functions for word comparison
function findUniqueWords(list1: string[], list2: string[]): {
  onlyInFirst: string[];
  onlyInSecond: string[];
} {
  // Create Sets from the arrays for O(1) lookups
  const set1 = new Set(list1);
  const set2 = new Set(list2);
  
  // Find words only in first list
  const onlyInFirst: string[] = [];
  set1.forEach(word => {
    if (!set2.has(word)) {
      onlyInFirst.push(word);
    }
  });
  
  // Find words only in second list
  const onlyInSecond: string[] = [];
  set2.forEach(word => {
    if (!set1.has(word)) {
      onlyInSecond.push(word);
    }
  });
  
  return { onlyInFirst, onlyInSecond };
}

function alphabetizeWords(words: string[]): string[] {
  return [...words].sort((a, b) => {
    // Remove $ prefix for alphabetical sorting
    const aWord = a.startsWith('$') ? a.slice(1).toLowerCase() : a.toLowerCase();
    const bWord = b.startsWith('$') ? b.slice(1).toLowerCase() : b.toLowerCase();
    return aWord.localeCompare(bWord);
  });
}

// Parse a single line of tab-separated values into an array of words
function parseTabSeparatedWords(content: string): string[] {
  // Split the content by tabs and remove any empty strings
  return content
    .trim()
    .split(/\t+/)
    .filter(word => word.length > 0 && word.startsWith('$'));
}

function App() {
  // File content state
  const [firstFileContent, setFirstFileContent] = useState<string[]>([]);
  const [secondFileContent, setSecondFileContent] = useState<string[]>([]);
  
  // Results state
  const [results, setResults] = useState<{
    wordsOnlyInFirst: string[];
    wordsOnlyInSecond: string[];
    allDifferences: string[];
  } | null>(null);

  // Process file content
  const handleFileContent = useCallback((content: string, fileNumber: 1 | 2) => {
    // Parse the content as tab-separated words
    const words = parseTabSeparatedWords(content);
    
    console.log(`File ${fileNumber} has ${words.length} words`);
    
    // Set the appropriate state based on file number
    if (fileNumber === 1) {
      setFirstFileContent(words);
    } else {
      setSecondFileContent(words);
    }
  }, []);

  // Compare the files
  const compareFiles = useCallback(() => {
    // Don't proceed if either file is empty
    if (firstFileContent.length === 0 || secondFileContent.length === 0) {
      console.error("Both files must have content");
      return;
    }
    
    console.log("First file has", firstFileContent.length, "words");
    console.log("Second file has", secondFileContent.length, "words");
    
    // Find the unique words in each file
    const { onlyInFirst, onlyInSecond } = findUniqueWords(
      firstFileContent, 
      secondFileContent
    );
    
    console.log("Words only in first file:", onlyInFirst.length);
    console.log("Words only in second file:", onlyInSecond.length);
    
    // Sort the results
    const sortedFirst = alphabetizeWords(onlyInFirst);
    const sortedSecond = alphabetizeWords(onlyInSecond);
    
    // Combine all differences
    const allDifferences = alphabetizeWords([...onlyInFirst, ...onlyInSecond]);
    
    // Set the results
    setResults({
      wordsOnlyInFirst: sortedFirst,
      wordsOnlyInSecond: sortedSecond,
      allDifferences
    });
  }, [firstFileContent, secondFileContent]);

  // Download the results
  const downloadResults = useCallback(() => {
    if (!results) return;

    // Format the output as tab-separated strings
    const firstLine = results.wordsOnlyInFirst.join('\t');
    const secondLine = results.wordsOnlyInSecond.join('\t');
    const allLine = results.allDifferences.join('\t');

    const content = 
      `Words only in first file:\n${firstLine}\n\n` +
      `Words only in second file:\n${secondLine}\n\n` +
      `All differences:\n${allLine}`;

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
          <p className="text-gray-600">Compare two lists of tab-separated words with $ prefixes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <FileUploader
            onFileContent={(content) => handleFileContent(content, 1)}
            label="First File"
            icon={<Upload className="w-6 h-6" />}
            fileNumber={1}
            hasContent={firstFileContent.length > 0}
          />
          <FileUploader
            onFileContent={(content) => handleFileContent(content, 2)}
            label="Second File"
            icon={<Upload className="w-6 h-6" />}
            fileNumber={2}
            hasContent={secondFileContent.length > 0}
          />
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={compareFiles}
            disabled={firstFileContent.length === 0 || secondFileContent.length === 0}
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

        {!results && firstFileContent.length > 0 && secondFileContent.length > 0 && (
          <div className="flex items-center justify-center text-gray-600 gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>Click Compare Files to see the results</span>
          </div>
        )}

        {results && (
          <div className="grid grid-cols-1 gap-6">
            <ResultsSection
              title="Only in First File"
              words={results.wordsOnlyInFirst}
              className="bg-red-50"
            />
            <ResultsSection
              title="Only in Second File"
              words={results.wordsOnlyInSecond}
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
