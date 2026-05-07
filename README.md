# MentorSync - AI Career Coaching Platform

MentorSync is a modern, AI-assisted career coaching app built with Next.js and Clerk. It helps professionals prepare for interviews, generate resumes and cover letters, and stay informed with industry insights.

## 🚀 Features

- **Personalized onboarding** for industry, role, and experience.
- **AI-powered interview preparation** with quiz assessments, score tracking, and mock interview flow.
- **AI cover letter generation** with job-specific content, history, and preview.
- **Resume builder and export** with live preview and PDF generation.
- **Industry insights dashboard** for market trends, salary ranges, and growth signals.
- **Protected user experience** powered by Clerk authentication.

## 🛠️ Tech Stack

- **Frontend**: Next.js 16.1.6 (App Router), React 19.2.3
- **Styling**: Tailwind CSS 4, Shadcn UI, Radix UI
- **Auth**: Clerk
- **Database**: PostgreSQL with Prisma
- **AI**: Google Gemini via `@ai-sdk/google` and `ai`
- **Background workflows**: Inngest
- **PDF export**: `html2canvas-pro` and `jspdf`

## 📁 Project Structure

```text
├── actions/          # Server-side actions and AI workflows
├── app/              # Next.js App Router pages and feature layouts
│   ├── (auth)/       # Clerk sign-in / sign-up flows
│   ├── (main)/       # Authenticated dashboard, AI features, resume, interview, onboarding
├── components/       # Reusable UI components
├── data/             # Static content and marketing data
├── lib/              # Utilities, Prisma client, Inngest setup, validation schemas
├── prisma/           # Prisma schema and migrations
└── public/           # Static assets
```

## ⚙️ Getting Started

### Prerequisites

- Node.js 18.x or later
- PostgreSQL database
- Clerk account for authentication
- Google Generative AI API key for AI features

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mentorsync
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Add environment variables in `.env`:
   ```env
   DATABASE_URL="your_postgresql_url"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_pub_key"
   CLERK_SECRET_KEY="your_clerk_secret_key"
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   GOOGLE_GENERATIVE_AI_API_KEY="your_google_api_key"
   ```

4. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run locally:
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000).

## 📊 Database Schema

Core Prisma models include:
- `User`: stores Clerk account link, profile data, industry, bio, experience, and skills.
- `Assessment`: stores interview quiz results, question details, and AI improvement tips.
- `Resume`: stores user resume content.
- `CoverLetter`: stores generated cover letters with job and company details.
- `IndustryInsight`: stores industry trends, salary ranges, demand levels, and recommended skills.

## 🚧 Scripts

- `npm run dev` — start development server
- `npm run build` — build production app
- `npm run start` — run production server
- `npm run lint` — lint project files

## 🤝 Contributing

Contributions are welcome. Open a PR with improvements, bug fixes, or documentation updates.

## 📄 License

This project is private and intended for internal use.
