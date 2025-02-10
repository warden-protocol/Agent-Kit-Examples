/**
 * Tokenize a JSON path into parts.
 * @example
 * tokenizePath("metadata.title") // -> ["metadata", "title"]
 * tokenizePath("chapters[*].content") // -> ["chapters[*]", "content"]
 */
export declare function tokenizePath(path: string): string[];
/**
 * Compare values for filtering, supporting operator-based comparisons.
 */
export declare function compareValues(itemValue: unknown, filterValue: unknown): boolean;
/**
 * Extract text from a value at a specific JSON path.
 *
 * Supports:
 * - Simple paths: "field1.field2"
 * - Array indexing: "[0]", "[*]", "[-1]"
 * - Wildcards: "*"
 * - Multi-field selection: "{field1,field2}"
 * - Nested paths in multi-field: "{field1,nested.field2}"
 */
export declare function getTextAtPath(obj: unknown, path: string[] | string): string[];
/**
 * Calculate cosine similarity between two vectors.
 */
export declare function cosineSimilarity(vector1: number[], vector2: number[]): number;
