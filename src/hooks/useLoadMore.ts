import { UseInfiniteQueryResult } from "@tanstack/react-query";
import { useCallback } from "react";

type Props = Pick<
  UseInfiniteQueryResult,
  "fetchNextPage" | "hasNextPage" | "isFetching"
>;

export const useLoadMore = ({
  fetchNextPage,
  hasNextPage,
  isFetching,
}: Props) => {
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetching]);

  return loadMore;
};
