import { chunk } from 'lodash';
import { useState, useMemo, useEffect } from 'react';

export const usePagination = <T>(arr: T[], pageSize: number) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const pages = useMemo(() => chunk(arr, pageSize), [arr, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [pages.length]);

  return {
    currentPage,
    setCurrentPage,
    pageData: pages[currentPage - 1] ?? [],
    totalPage: pages.length
  };
};
