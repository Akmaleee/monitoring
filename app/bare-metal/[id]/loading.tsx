import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Loading() {
  return (
    <div className="container mx-auto py-10 space-y-8 animate-pulse">
      
      {/* Skeleton untuk Card Detail */}
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-5 w-[150px]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-5 w-[150px]" />
          </div>
        </CardContent>
      </Card>

      {/* Skeleton untuk Tabel Node */}
      <div>
        <Skeleton className="h-8 w-1/4 mb-4" />
        
        <div className="flex items-center py-4">
          <Skeleton className="h-10 w-full max-w-sm" />
        </div>

        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {/* Sesuaikan dengan jumlah kolom di tabel node (ada 5) */}
                <TableHead><Skeleton className="h-5 w-full" /></TableHead>
                <TableHead><Skeleton className="h-5 w-full" /></TableHead>
                <TableHead><Skeleton className="h-5 w-full" /></TableHead>
                <TableHead><Skeleton className="h-5 w-full" /></TableHead>
                <TableHead><Skeleton className="h-5 w-[100px]" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
}