// src/utils/comparison.ts
export function findDifferences(list1: string[], list2: string[]): {
  onlyInFirst: string[];
  onlyInSecond: string[];
} {
  // First, ensure we work with arrays, not undefined
  const safeList1 = list1 || [];
  const safeList2 = list2 || [];
  
  // Create Sets of unique words from each list
  const set1 = new Set(safeList1);
  const set2 = new Set(safeList2);
  
  // Find words only in first list (not in second)
  const onlyInFirst: string[] = [];
  set1.forEach(word => {
    if (!set2.has(word)) {
      onlyInFirst.push(word);
    }
  });
  
  // Find words only in second list (not in first)
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

export function alphabetizeWithPrefix(words: string[]): string[] {
  // Create a copy of the array to avoid modifying the original
  return [...words].sort((a, b) => {
    // Remove $ prefix for comparison
    const aWord = a.slice(1);
    const bWord = b.slice(1);
    return aWord.localeCompare(bWord);
  });
}
