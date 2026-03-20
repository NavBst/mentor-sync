import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const DashLoad = () => {
  return (
    <div>
      <Skeleton className={"my-3 h-4 w-37.5"} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="w-full max-w-xs">
          <CardContent>
            <Skeleton className="aspect-video w-full" />
          </CardContent>
        </Card>{" "}
        <Card className="w-full max-w-xs">
          <CardContent>
            <Skeleton className="aspect-video w-full" />
          </CardContent>
        </Card>{" "}
        <Card className="w-full max-w-xs">
          <CardContent>
            <Skeleton className="aspect-video w-full" />
          </CardContent>
        </Card>{" "}
        <Card className="w-full max-w-xs">
          <CardContent>
            <Skeleton className="aspect-video w-full" />
          </CardContent>
        </Card>
      </div>
      <div>
        <Card className="w-full max-w-full my-3">
          <CardHeader>
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-2 w-56" />
          </CardHeader>
          <CardContent>
            <Skeleton className="aspect-video w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashLoad;
