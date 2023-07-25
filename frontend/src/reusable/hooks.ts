import { useEffect, useRef } from 'react';
import { api } from '../store';
import { Test, TestWithAvatar } from '../types/Test';

export const useScroll = (
    baseRequest: string,
    setTestList: React.Dispatch<React.SetStateAction<any>>
  ) => {
  let nextPage = useRef<string | null>();
  let isLoading = useRef(false);

  const fetchTestListData = async () => {

    if (!nextPage.current) return;

    if (isLoading.current) return;
    isLoading.current = true;

    try {
      const {data} = await api.get(nextPage.current);
      setTestList((prevState: any) => [...prevState, ...data.results]);
      nextPage.current = (data.next ? data.next.slice(22) : null);
    } finally {
      isLoading.current = false;
    }
  }

  useEffect(() => {
    nextPage.current = baseRequest;
    setTestList([]);
    fetchTestListData();

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [baseRequest]);

  const handleScroll = () => {
    const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;

    if (bottom) {
      fetchTestListData();
    }
  }
}
