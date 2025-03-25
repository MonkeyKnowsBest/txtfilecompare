export function findDifferences(list1: string[], list2: string[]): {
  onlyInFirst: string[];
  onlyInSecond: string[];
} {
  // Convert input lists to Sets to remove duplicates within each list
  const uniqueList1 = [...new Set(list1)];
  const uniqueList2 = [...new Set(list2)];
  
  // Create Sets for efficient lookups
  const set1 = new Set(uniqueList1);
  const set2 = new Set(uniqueList2);

  // Now filter using the deduplicated lists
  const onlyInFirst = uniqueList1.filter(word => !set2.has(word));
  const onlyInSecond = uniqueList2.filter(word => !set1.has(word));

  return { onlyInFirst, onlyInSecond };
}

export function alphabetizeWithPrefix(words: string[]): string[] {
  return [...words].sort((a, b) => {
    // Remove $ prefix for comparison
    const aWord = a.slice(1);
    const bWord = b.slice(1);
    return aWord.localeCompare(bWord);
  });
}
