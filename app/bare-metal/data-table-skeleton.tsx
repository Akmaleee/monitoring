import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DataTableSkeleton() {
  return (
    <div className="container mx-auto py-10">
      {/* Skeleton untuk Header dan Filter */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-10 w-1/4" />
      </div>

      {/* Skeleton untuk Tabel */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {/* Sesuaikan jumlah TableHead dengan jumlah kolom Anda */}
              <TableHead><Skeleton className="h-5 w-[100px]" /></TableHead>
              <TableHead><Skeleton className="h-5 w-full" /></TableHead>
              <TableHead><Skeleton className="h-5 w-full" /></TableHead>
              <TableHead><Skeleton className="h-5 w-full" /></TableHead>
              <TableHead><Skeleton className="h-5 w-full" /></TableHead>
              <TableHead><Skeleton className="h-5 w-[100px]" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Buat beberapa baris skeleton */}
            {Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell colSpan={6}>
                  <Skeleton className="h-8 w-full" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Skeleton untuk Pagination */}
       <div className="flex items-center justify-end space-x-2 py-4">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}