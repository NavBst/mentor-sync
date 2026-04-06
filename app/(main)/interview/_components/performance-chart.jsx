"use client";
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";

const PerformanceChart = ({ assessments }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (assessments) {
      const formattedData = assessments.map((assessment) => ({
        date: format(new Date(assessment.createdAt), "MMM dd"),
        score: assessment.quizScore,
      }));
      setChartData(formattedData);

    }
  }, [assessments]);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl md:text-4xl gradient-title ">
          Performance Trend
        </CardTitle>
        <CardDescription>Your Quiz Scores Over Time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width={"100%"} height={"100%"} >
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date"  />
              <YAxis domain={[0, 100]}  />
              <Tooltip content={({active, payload})=>{
         
                  if(active && payload?.length){
                  
                    return(
                      <div className="bg-background border rounded-lg p-2 shadow-md">
                        <p className="text-xs text-muted-foreground font-medium">
                          Score: {payload[0].value.toFixed(2)}%
                        </p>
                        <p className="text-xs text-muted-foreground font-medium">
                          {payload[0].payload.date}
                        </p>
                      </div>
                    )
                  }
              }}   />
              <Legend />
              <Line
                type={"monotone"}
                dataKey={"score"}
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
