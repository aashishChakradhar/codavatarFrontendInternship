import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <Skeleton className="aspect-video w-full mb-5" />
        <div className="flex gap-15">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <Skeleton className="h-4 " />
        <Skeleton className="h-4 " />
        <Skeleton className="h-4 " />
        <div></div>
      </CardContent>
    </Card>
  );
}
