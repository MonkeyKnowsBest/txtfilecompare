export function findDifferences(list1: string[], list2: string[]): {
  onlyInFirst: string[];
  onlyInSecond: string[];
} {
  const set1 = new Set(list1);
  const set2 = new Set(list2);

  const onlyInFirst = list1.filter(word => !set2.has(word));
  const onlyInSecond = list2.filter(word => !set1.has(word));

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