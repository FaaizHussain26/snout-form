import { useState, useCallback } from "react";
import type { PaginationInfo } from "@/api/leads";

interface UsePaginationProps {
  initialPage?: number;
  initialLimit?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  limit: number;
  pagination: PaginationInfo | null;
  setCurrentPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setPagination: (pagination: PaginationInfo) => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

export function usePagination({
  initialPage = 1,
  initialLimit = 10,
}: UsePaginationProps = {}): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  const goToNextPage = useCallback(() => {
    if (pagination?.hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, pagination?.hasNextPage]);

  const goToPrevPage = useCallback(() => {
    if (pagination?.hasPrevPage) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage, pagination?.hasPrevPage]);

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToLastPage = useCallback(() => {
    if (pagination?.totalPages) {
      setCurrentPage(pagination.totalPages);
    }
  }, [pagination?.totalPages]);

  const canGoNext = pagination?.hasNextPage ?? false;
  const canGoPrev = pagination?.hasPrevPage ?? false;

  return {
    currentPage,
    limit,
    pagination,
    setCurrentPage,
    setLimit,
    setPagination,
    goToNextPage,
    goToPrevPage,
    goToFirstPage,
    goToLastPage,
    canGoNext,
    canGoPrev,
  };
}
