import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="container mx-auto py-10 space-y-8 animate-pulse">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent>
           <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-5 w-[200px]" />
              <Skeleton className="h-5 w-[200px]" />
              <Skeleton className="h-5 w-[200px]" />
              <Skeleton className="h-5 w-[200px]" />
           </div>
        </CardContent>
      </Card>

      <div>
        <Skeleton className="h-8 w-1/4 mb-4" />
        <div className="overflow-hidden rounded-md border">
           <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  );
}