# MentorSync - AI-Powered Career Coaching Platform

MentorSync is a modern, AI-driven career coaching platform designed to help professionals accelerate their career growth. By leveraging advanced AI technology, MentorSync provides personalized guidance, interview preparation, industry insights, and smart document generation to give users a competitive edge in the job market.

## 🚀 Features

- **AI-Powered Career Guidance**: Get personalized career advice and strategic insights tailored to your professional background and goals.
- **Interview Preparation**: Practice with role-specific mock interviews and receive instant, actionable feedback to improve your performance.
- **Industry Insights**: Stay ahead of the curve with real-time trends, salary data, and comprehensive market analysis across 50+ industries.
- **Smart Resume & Cover Letter Creation**: Generate ATS-optimized resumes and professional cover letters with AI assistance to stand out to recruiters.
- **Personalized Onboarding**: A tailored experience that starts with understanding your unique professional journey and aspirations.
- **Progress Dashboard**: Track your assessments, applications, and career growth in one centralized location.

## 🛠️ Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/), [Prisma](https://www.prisma.io/)
- **Background Jobs**: [Inngest](https://www.inngest.com/)
- **Theming**: [Next Themes](https://github.com/pacocoursey/next-themes) (Dark/Light mode support)

## 📁 Project Structure

```text
├── actions/          # Server actions for user management
├── app/              # Next.js App Router (Auth, Dashboard, AI features)
├── components/       # Reusable UI components and layout elements
├── data/             # Static content (FAQs, Features, Testimonials)
├── lib/              # Shared utilities, Prisma client, and Inngest configuration
├── prisma/           # Database schema and migrations
└── public/           # Static assets (images, icons, etc.)
```

## ⚙️ Getting Started

### Prerequisites

- Node.js 18.x or later
- A PostgreSQL database (e.g., Supabase, Neon, or local)
- A Clerk account for authentication

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd mentorsync
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL="your_postgresql_url"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_pub_key"
   CLERK_SECRET_KEY="your_clerk_secret_key"
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   # Add any AI model API keys if required (e.g., GEMINI_API_KEY)
   ```

4. **Initialize the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📊 Database Schema

The project uses Prisma with a robust schema including:
- `User`: Profiles, skills, and industry associations.
- `Assessment`: AI-generated quiz scores and improvement tips.
- `Resume` & `CoverLetter`: Management for professional documents.
- `IndustryInsight`: Dynamic market data, salary ranges, and growth trends.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and intended for internal use.
