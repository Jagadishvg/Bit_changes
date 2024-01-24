import React, { useState, ReactNode } from 'react';
import { SearchContext } from './search-context';

export type SearchProviderProps = {
  children: ReactNode
};

export function SearchProvider({ children }: SearchProviderProps) {
  const [search, setSearch] = useState([]);
  const [searchTerm, setSearchTerm] = useState();
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);

  const searchProduct = (item1,item2 ) => {
    setSearch(item1);
    setSearchTerm(item2);
  }
  const setSubcategory = (subcategory: string | null) => {
    setSelectedSubcategories((prevSubcategories) => {
      if (subcategory === null) {
        return [];
      } else if (prevSubcategories.includes(subcategory)) {
        return prevSubcategories.filter((item) => item !== subcategory);
      } else {
        return [...prevSubcategories, subcategory];
      }
    });
  };



  const contextValue = {
    search,
    searchTerm,
    searchProduct,
    selectedSubcategories,
    setSubcategory,
  };

  return <SearchContext.Provider value={ contextValue }>{children}</SearchContext.Provider>
}
