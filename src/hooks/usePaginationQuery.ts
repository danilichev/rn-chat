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
      const result = await queryFn({ ...variables, offset });

      setData((prev) => [...prev, ...result.data]);
      setTotal(result.total);

      return result.data;
    },
    queryKey: [...queryKey, variables.limit.toString(), offset.toString()],
  });

  const hasMore = useMemo(() => data.length < total, [data, total]);

  const loadMore = useCallback(() => {
    if (hasMore) {
      setOffset(data.length);
    }
  }, [data, hasMore]);

  return { ...result, data, hasMore, loadMore };
};
