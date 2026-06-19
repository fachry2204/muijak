"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface PageContentContextType {
  contents: Record<string, string>;
  refreshContents: () => Promise<void>;
  updateContentLocally: (key: string, content: string) => void;
  isAdmin: boolean;
}

const PageContentContext = createContext<PageContentContextType>({
  contents: {},
  refreshContents: async () => {},
  updateContentLocally: () => {},
  isAdmin: false,
});

export function PageContentProvider({ children, session }: { children: React.ReactNode, session?: any }) {
  const [contents, setContents] = useState<Record<string, string>>({});
  
  const refreshContents = async () => {
    try {
      const res = await axios.get('/api/page-content');
      if (res.data.success) {
        const newContents: Record<string, string> = {};
        res.data.data.forEach((item: any) => {
          newContents[item.section_key] = item.content;
        });
        setContents(newContents);
      }
    } catch (err) {
      console.error("Failed to load page contents", err);
    }
  };

  useEffect(() => {
    refreshContents();
  }, []);

  const updateContentLocally = (key: string, content: string) => {
    setContents(prev => ({ ...prev, [key]: content }));
  };

  return (
    <PageContentContext.Provider value={{ 
      contents, 
      refreshContents, 
      updateContentLocally,
      isAdmin: !!session 
    }}>
      {children}
    </PageContentContext.Provider>
  );
}

export function usePageContent() {
  return useContext(PageContentContext);
}
