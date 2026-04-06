import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const QuizLoader = () => {
  return (
    <div>
      <Card className="mx-2">
        <CardHeader>
          <Skeleton className="h-4 w-44" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-80 mb-5" />
          <Skeleton className="h-52 w-full mb-5" />
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizLoader;
