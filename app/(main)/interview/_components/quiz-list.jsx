"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import QuizResult from "./quiz-result";

const QuizList = ({ assessments }) => {
  const router = useRouter();
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  return (
    <>
      <Card>
        <CardHeader className={"flex justify-between items-center"}>
          <div>
            <CardTitle className="text-3xl md:text-4xl gradient-title">
              Recent Quizes
            </CardTitle>
            <CardDescription>Review your past quiz performance</CardDescription>
          </div>
          <Button onClick={() => router.push("/interview/mock")}>
            Start New Quiz
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assessments.map((assessment, i) => {
              return (
                <Card
                  key={assessment.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors duration-150"
                  onClick={() => setSelectedQuiz(assessment)}
                >
                  <CardHeader>
                    <CardTitle className="text-xl">Quiz {i + 1}</CardTitle>
                    <CardDescription className="flex justify-between">
                      <div>{assessment.quizScore.toFixed(1)}%</div>
                      <div>
                        {format(
                          new Date(assessment.createdAt),
                          "MMMM dd, yyyy HH:mm",
                        )}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>{assessment.improvementTip}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* dialog  */}
      <Dialog
        open={!!selectedQuiz}
        onOpenChange={() => {
          setSelectedQuiz(null);
        }}
      >
        <DialogContent className={"max-w-4xl max-h-[90vh] overflow-y-auto"}>
          <DialogHeader> 
            <DialogTitle>{}</DialogTitle>

            <QuizResult
              result={selectedQuiz}
              onStartNew={() => router.push("/interview/mock")}
              hideStartNew
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuizList;
