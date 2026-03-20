import { google } from "@ai-sdk/google";
import { db } from "../prisma";
import { inngest } from "./client";
import { generateText } from "ai";

export const generateIndustryInsights = inngest.createFunction(
  {
    name: "Generate Industry Insights",
  },
  {
    cron: "0 0 * * 0",
  },
  async ({ step }) => {
    const industries = await step.run("Fetch industries", async () => {
      return await db.industryInsight.findMany({
        select: { industry: true },
      });
    });

    for (const { industry } of industries) {  
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

      const res = await step.run("gemini", generateText, {
        model: google("gemini-3.1-flash-lite-preview"),
        prompt,
      });
      console.log(res._output);
      const insights = JSON.parse(res._output);

      await step.run(`Update ${industry} insights`, async () => {
        await db.industryInsight.update({
          where: {
            industry,
          },
          data: {
            ...insights,
            lastUpdated: new Date(),
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), //
          },
        });
      });
    }
  },
);
