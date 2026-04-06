"use client";
import { entrySchema } from "@/app/lib/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const EntryForm = ({ type, entries, onChange }) => {
  const [isAdding, setIsAdding] = useState(false);
  const {
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  });

  return (
    <div>

       {isAdding && (
        <Card>
            <CardHeader>
                <CardTitle>Add {type}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Input 
                            placeholder="Title/Position"
                            {...register("title")}
                            error={errors.title}
                        />
                        {
                            errors.title && (
                                <p className="text-sm text-red-500">{errors.title.message}</p>
                            )
                        }
                    </div>

                    <div className="space-y-2">
                        <Input 
                            placeholder="Organization/Position"
                            {...register("title")}
                            error={errors.title}
                        />
                        {
                            errors.title && (
                                <p className="text-sm text-red-500">{errors.title.message}</p>
                            )
                        }
                    </div>
                </div>
            </CardContent>
        </Card>
       )} 
      {!isAdding && (
        <Button
          className="w-full"
          variant="outline"
          onClick={() => setIsAdding(true)}
        >
          <PlusCircle className="w-4 h-4 m-2" />
          Add {type}
        </Button>
      )}
    </div>
  );
};

export default EntryForm;
