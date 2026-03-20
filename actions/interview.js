"use server";

import { db } from "@/lib/prisma";
import { google } from "@ai-sdk/google";
import { auth } from "@clerk/nextjs/server";
import { generateText } from "ai";

export async function generateQuiz() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized!");
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) throw new Error("User not Found!");

  const prompt = `
    Generate 10 technical interview questions for a ${
      user.industry
    } professional${
      user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
    }.
    
    Each question should be multiple choice with 4 options.
    
    Return ONLY valid JSON (no markdown, no code blocks) in this format:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

  try {
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt,
    });
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```")) {
      // Remove opening ``` and optional language identifier (e.g., ```json)
      cleanedText = cleanedText.replace(/^```(?:json)?\n/, "");
      // Remove closing ```
      cleanedText = cleanedText.replace(/\n```$/, "");
    }

    let res = JSON.parse(cleanedText);

    return res.questions;
  } catch (error) {
    console.error("Error genrating quiz questions", error);
    throw new Error("Failed to generate quiz questions!");
  }
}

export async function saveQuizResult(questions, answers, score) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized!");
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) throw new Error("User not Found!");

  const questionResults = questions.map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }));

  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);
  let improvementTip = null;
  if (wrongAnswers.length > 0) {
    const wrongQuestionText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.question}" \nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`,
      )
      .join("\n\n");

    const improvementPrompt = `The user got the following  ${user.industry} techinical interview questions wrong:
    
    ${wrongQuestionText}
    
    Based on these mistake, provide, a concise, specific improvement tip.
    Focus on the knowledge gaps revealed by these wrong answers. 
    Keep the response under 2 sentences and make it ecouraging. 
    Don't explicitly mention the mistake, instead focus on what to learn/practice.
    `;

    try {
      const { text } = await generateText({
        model: google("gemini-2.5-flash-lite"),
        prompt: improvementPrompt,
      });

      improvementTip = text;
    } catch (error) {
      console.error("Error Generating Improvement Tips", error.message);
      throw new Error("");
    }

    try {
      const assessment = await db.assessment.create({
        data: {
          userId: user.id,
          quizScore: score,
          questions: questionResults,
          category: "Technical",
          improvementTip,
        },
      });

      return assessment;
    } catch (error) {
      console.error("Failed to");
      throw new Error("Failed to generate Quiz", error);
    }
  }
}
