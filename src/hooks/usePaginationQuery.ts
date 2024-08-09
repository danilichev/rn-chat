import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

import { Pagination, PaginationResult } from "src/types/common";

type Props<T, V extends Pagination> = Omit<UseQueryOptions<T[]>, "queryFn"> & {
  queryFn: (props: V) => Promise<PaginationResult<T>>;
  variables: V;
};

type Result<T> = Omit<UseQueryResult<T[]>, "data"> & {
  data: T[];
  hasMore: boolean;
  loadMore: () => void;
};

export const usePaginationQuery = <T, V extends Pagination = Pagination>({
  queryFn,
  queryKey,
  variables,
  ...rest
}: Props<T, V>): Result<T> => {
  const [data, setData] = useState<T[]>([]);
  const [offset, setOffset] = useState(variables.offset || 0);
  const [total, setTotal] = useState(variables.limit);

  const result = useQuery({
    ...rest,
    queryFn: async () => {
      const res = await queryFn({ ...variables, offset });

      setData((prev) => [...prev, ...res.data]);
      console.log("res.data.length", res.data.length);
      setTotal(res.total);

      return res.data;
    },
    queryKey: [...queryKey, variables.limit, offset],
  });

  const hasMore = useMemo(() => data.length < total, [data.length, total]);

  const loadMore = useCallback(() => {
    if (hasMore && !result.isFetching) {
      setOffset(data.length);
    }
  }, [data.length, hasMore, result.isFetching]);

  return {
    ...result,
    data: data.length ? data : result.data || [],
    hasMore,
    loadMore,
  };
};
