import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "mentorsync", name: "MentorSync", env: process.env.GOOGLE_GENERATIVE_AI_API_KEY});