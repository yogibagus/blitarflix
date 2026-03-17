'use client';

import { useState, useEffect, useCallback } from 'react';

export interface MyListItem {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
  type: 'movie' | 'tv';
  addedAt: number;
}

const MY_LIST_STORAGE_KEY = 'blitarflix_my_list';

export function useMyList() {
  const [myList, setMyList] = useState<MyListItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(MY_LIST_STORAGE_KEY);
      if (stored) {
        setMyList(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading my list from localStorage:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever myList changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(MY_LIST_STORAGE_KEY, JSON.stringify(myList));
      } catch (error) {
        console.error('Error saving my list to localStorage:', error);
      }
    }
  }, [myList, isLoaded]);

  const addToList = useCallback((item: Omit<MyListItem, 'addedAt'>) => {
    setMyList((prev) => {
      // Check if already in list
      if (prev.some((i) => i.id === item.id && i.type === item.type)) {
        return prev;
      }
      return [...prev, { ...item, addedAt: Date.now() }];
    });
  }, []);

  const removeFromList = useCallback((id: number, type: 'movie' | 'tv') => {
    setMyList((prev) => prev.filter((item) => !(item.id === id && item.type === type)));
  }, []);

  const isInList = useCallback((id: number, type: 'movie' | 'tv' = 'movie') => {
    return myList.some((item) => item.id === id && item.type === type);
  }, [myList]);

  const toggleItem = useCallback((item: Omit<MyListItem, 'addedAt'>) => {
    if (isInList(item.id, item.type)) {
      removeFromList(item.id, item.type);
    } else {
      addToList(item);
    }
  }, [isInList, removeFromList, addToList]);

  const clearList = useCallback(() => {
    setMyList([]);
  }, []);

  return {
    myList,
    isLoaded,
    addToList,
    removeFromList,
    isInList,
    toggleItem,
    clearList,
  };
}
