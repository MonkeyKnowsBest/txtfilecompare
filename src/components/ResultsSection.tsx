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
  return (
    <div className={`rounded-lg p-4 ${className}`}>
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <div className="bg-white rounded-md shadow-sm p-4 overflow-x-auto">
        {!words || words.length === 0 ? (
          <p className="text-gray-500 text-center">No differences found</p>
        ) : (
          <div className="whitespace-nowrap">
            {words.map((word, index) => (
              <span
                key={`${word}-${index}`}
                className="font-mono text-sm inline-block"
              >
                {word}{index < words.length - 1 ? '\t' : ''}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
