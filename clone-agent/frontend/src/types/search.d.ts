export interface SearchResult {
  id: string;
  title: string;
  path: string;
  description?: string;
  category?: string;
}

export interface SearchState {
  isSearchOpen: boolean;
  query: string;
  results: SearchResult[];
  selectedIndex: number;
  isLoading: boolean;
  error: string | null;
  setIsSearchOpen: (isOpen: boolean) => void;
  setQuery: (query: string) => void;
  setResults: (results: SearchResult[]) => void;
  setSelectedIndex: (index: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}
