import { createContext } from 'react';

export type SearchContextType = {
  search: Array<any>;
  searchTerm: string;
  selectedSubcategories: string[];
  setSubcategory: (subcategory: string | null) => void;
  searchProduct: (item1: any, item2: any) => void;
};

export const SearchContext = createContext<SearchContextType>({
  search: [],
  searchTerm: '',
  selectedSubcategories: [],
  setSubcategory: () => {},
  searchProduct: () => {},
});