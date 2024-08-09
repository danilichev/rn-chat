import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { useRef, useState } from "react";

import { Pagination, PaginationResult } from "src/types/common";

type Props<T, V extends Pagination> = Omit<UseQueryOptions<T[]>, "queryFn"> & {
  queryFn: (props: V) => Promise<PaginationResult<T>>;
  variables: V;
};

type Result<T> = UseQueryResult<T[]> & {
  hasMore: boolean;
};

export const usePaginationQuery = <T, V extends Pagination = Pagination>({
  queryFn,
  queryKey,
  variables,
  ...rest
}: Props<T, V>): Result<T> => {
  const data = useRef<T[]>([]);
  const offset = useRef(variables.offset || 0);

  const [total, setTotal] = useState(variables.limit);

  const result = useQuery<T[]>({
    ...rest,
    placeholderData: [],
    queryFn: async () => {
      const result = await queryFn({ ...variables, offset: offset.current });

      data.current = [...data.current, ...result.data];
      offset.current += result.data.length;

      setTotal(result.total);

      return data.current;
    },
    queryKey: [...queryKey, variables.limit, variables.offset],
  });

  return { ...result, hasMore: data.current.length < total };
};
