"use server";

import { db } from "@/lib/prisma";
import { google } from "@ai-sdk/google";
import { auth } from "@clerk/nextjs/server";
import { generateText } from "ai";

export const generateAIInsights = async (industry) => {
  console.log(industry);
  const prompt = ` Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "HIGH" | "MEDIUM" | "LOW",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
          Keep skills simple and one word if possible`;

       const {text} =await generateText({
            model: google("gemini-2.5-flash"),
            prompt,
        }
        )
        let res = JSON.parse(text);

        return res;
};



export async function getIndustrialInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized!");
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
    include:{
      industryInsight :  true,
    }
  });
  if (!user) throw new Error("User does not exist!");

  if (!user.industryInsight) {
    const insights = await generateAIInsights(user.industry);

    const industryInsight = await db.industryInsight.create({
      data: {
        industry: user.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), //
      },
    });

    return industryInsight;
  }

  return user.industryInsight;
}
