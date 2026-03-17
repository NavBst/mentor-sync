// import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});


export const db = new PrismaClient({adapter});

if(process.env.NODE_ENV !== "production"){
    globalThis.prisma = db;
}

// globalThis.prisma : this global variable esures that the Prisma client instance is reused across hot reloads during
// development. Without this, each time application reloads, a new instance of the Prisma client would be created,
// potentially leading to connection issue.