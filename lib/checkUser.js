import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();
    // console.log(user)
  if (!user) {
    return null;
  }
  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    // console.log(loggedInUser)
    if(loggedInUser){
        return loggedInUser;
    }
    
    const email = user.emailAddresses[0].emailAddress;
    const name = `${user.firstName} ${user.lastName}`;
    
    // Check if user exists by email and update if needed
    const existingUserByEmail = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if(existingUserByEmail){
        // Update existing user with clerkUserId
        const updatedUser = await db.user.update({
            where: { email: email },
            data: {
                clerkUserId: user.id,
                name,
            }
        });
        return updatedUser;
    }

    // Create new user if neither clerkUserId nor email exists
    const newUser = await db.user.create({
        data:{
            clerkUserId: user.id,
            name,
            email: email,
        }
    })

    return newUser;

  } catch (error) {
    console.log(error.message);
  }
};
