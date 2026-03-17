"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized!");
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  // console.log(data);
  if (!user) throw new Error("User does not exist!");

  try {
    const result = await db.$transaction(
      async (txn) => {
        // find if the industry exists
        let industryInsight = await txn.industryInsight.findUnique({
          where: {
            industry: data.industry,
          },
        });

        // If industry doesn't exist, create it with default values - will replace it with ai later
        if (!industryInsight) {
          const insights = await generateAIInsights(user.industry);  

          industryInsight = await db.industryInsight.create({
            data: {
              industry: data.industry,
              ...insights,
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), //
            },
          });

        }

        // update the user
        const updatedUser = await txn.user.update({
          where: {
            id: user.id,
          },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
          },
        });
        console.log(updatedUser)
        return { updatedUser, industryInsight };
      },
      { timeout: 40000 },
    );

    return { success: true, ...result };
  } catch (error) {
    console.error("Error Updating user and industry:", error.message);
    throw new Error("Failed to update profile", error.message);
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized!");
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) throw new Error("User does not exist!");

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        industry: true,
      },
    });

    return { isOnboarded: !!user?.industry };
  } catch (error) {}
}
