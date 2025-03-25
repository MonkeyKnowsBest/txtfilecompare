export function findDifferences(list1: string[], list2: string[]): {
  onlyInFirst: string[];
  onlyInSecond: string[];
} {
  // Create new arrays to avoid modifying the originals
  const array1 = [...list1];
  const array2 = [...list2];
  
  // Create Sets for efficient lookups
  const set1 = new Set(array1);
  const set2 = new Set(array2);
  
  // Words ONLY in the first list (filter out any that also appear in second list)
  const onlyInFirst: string[] = array1.filter(word => !set2.has(word));
  
  // Words ONLY in the second list (filter out any that also appear in first list)
  const onlyInSecond: string[] = array2.filter(word => !set1.has(word));
  
  // Remove duplicates from the results
  return {
    onlyInFirst: [...new Set(onlyInFirst)],
    onlyInSecond: [...new Set(onlyInSecond)]
  };
}

export function alphabetizeWithPrefix(words: string[]): string[] {
  return [...words].sort((a, b) => {
    // Remove $ prefix for comparison
    const aWord = a.slice(1).toLowerCase(); // Add toLowerCase for case-insensitive sorting
    const bWord = b.slice(1).toLowerCase();
    return aWord.localeCompare(bWord);
  });
}
