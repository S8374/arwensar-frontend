import { useGetSupplierByIdQuery } from "@/redux/features/vendor/vendor.api";

// src/hooks/useSupplierById.ts
export const useSupplierById = (id: string) => {
  const { data, isLoading, error, refetch } = useGetSupplierByIdQuery(id, {
    skip: !id,
  });

  return {
    supplier: data?.data,
    isLoading,
    error,
    refetch,
  };
};