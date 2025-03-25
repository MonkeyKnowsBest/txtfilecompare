import React from 'react';

interface ResultsSectionProps {
  title: string;
  words: string[];
  className?: string;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  title,
  words,
  className = '',
}) => {
  // Calculate the actual number of words
  const wordCount = words ? words.length : 0;
  
  return (
    <div className={`rounded-lg p-4 ${className}`}>
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <div className="bg-white rounded-md shadow-sm p-4 max-h-96 overflow-y-auto">
        {!words || wordCount === 0 ? (
          <p className="text-gray-500 text-center">No differences found</p>
        ) : (
          <ul className="space-y-1">
            {words.map((word, index) => (
              <li
                key={`${word}-${index}`}
                className="font-mono text-sm"
              >
                {word}
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="text-sm text-gray-500 mt-2">{wordCount} {wordCount === 1 ? 'word' : 'words'}</p>
    </div>
  );
};
