/**
 * Functions for comparing word lists and parsing file content
 */

/**
 * Parses a file containing tab-separated words.
 * Works with both single-line tab-separated words and multiple lines.
 */
export function parseFileContent(content: string): string[] {
  // First check if the content has multiple lines with significant content
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
  
  // If there's only one meaningful line, assume tab-separated format
  if (lines.length === 1) {
    return parseTabSeparatedLine(lines[0]);
  }
  
  // Otherwise, process each line to extract words
  return lines
    .map(line => extractWordsFromLine(line))
    .flat()
    .filter((word, index, self) => self.indexOf(word) === index); // Remove duplicates
}

/**
 * Parses a single line of tab-separated words
 */
export function parseTabSeparatedLine(line: string): string[] {
  return line
    .trim()
    .split(/\t+/)
    .filter(word => word.length > 0 && word.startsWith('$'));
}

/**
 * Extracts $-prefixed words from any text line
 */
export function extractWordsFromLine(line: string): string[] {
  const words: string[] = [];
  const regex = /(\$\w+)/g;
  let match;
  
  while ((match = regex.exec(line)) !== null) {
    if (match[1].length > 1) { // Ensure word is longer than just $
      words.push(match[1]);
    }
  }
  
  return words;
}

/**
 * Finds words that are unique to each list.
 */
export function findDifferences(list1: string[], list2: string[]): {
  onlyInFirst: string[];
  onlyInSecond: string[];
} {
  // Create Sets for efficient lookups
  const set1 = new Set(list1);
  const set2 = new Set(list2);
  
  // Words ONLY in the first list
  const onlyInFirst: string[] = [];
  set1.forEach(word => {
    if (!set2.has(word)) {
      onlyInFirst.push(word);
    }
  });
  
  // Words ONLY in the second list
  const onlyInSecond: string[] = [];
  set2.forEach(word => {
    if (!set1.has(word)) {
      onlyInSecond.push(word);
    }
  });
  
  return {
    onlyInFirst,
    onlyInSecond
  };
}

/**
 * Alphabetically sorts a list of words, ignoring $ prefix
 */
export function alphabetizeWords(words: string[]): string[] {
  return [...words].sort((a, b) => {
    // Remove $ prefix for alphabetical sorting
    const aWord = a.startsWith('$') ? a.slice(1).toLowerCase() : a.toLowerCase();
    const bWord = b.startsWith('$') ? b.slice(1).toLowerCase() : b.toLowerCase();
    return aWord.localeCompare(bWord);
  });
}

/**
 * Gets statistics about the word lists
 */
export function getStatistics(list1: string[], list2: string[]): {
  countList1: number;
  countList2: number;
  commonCount: number;
  onlyInFirstCount: number;
  onlyInSecondCount: number;
} {
  const { onlyInFirst, onlyInSecond } = findDifferences(list1, list2);
  
  const onlyInFirstCount = onlyInFirst.length;
  const onlyInSecondCount = onlyInSecond.length;
  const commonCount = list1.length - onlyInFirstCount;
  
  return {
    countList1: list1.length,
    countList2: list2.length,
    commonCount,
    onlyInFirstCount,
    onlyInSecondCount
  };
}
