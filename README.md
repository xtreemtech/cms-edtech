# 📚 CMS-EdTech

A **Content Management System (CMS)** for educational articles, built with **React Router, Prisma, Supabase, and Vercel**.  
This project supports **tree-structured articles**, editing drafts, and managing content seamlessly.

---

## 🚀 Features

- ✨ React Router v6 for frontend routing (SPA + SSR build)
- 📦 Prisma ORM with Supabase (PostgreSQL)
- 📝 Article tree structure with parent/child relationships
- 🔒 Authentication (Supabase Auth)
- 🌐 Deployed on Vercel
- ⚡ Fast builds with Vite
- 🎨 Styled with TailwindCSS

---

## 🛠️ Tech Stack

- **Frontend:** React Router + Vite
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Styling:** TailwindCSS
- **Deployment:** Vercel

❓ Why not Remix?

This project was originally suggested to be built with Remix.
However, Remix is currently in maintenance mode. The Remix team officially merged its functionality into React Router v7, meaning that the same data APIs and server rendering concepts are now available directly inside React Router.

Because of this merge:

React Router v7 provides the same loaders and actions system for data fetching and mutations.

The project can be built with a modern, maintained toolset without depending on a framework that is no longer being actively developed.

Deployment and integration with tools like Vercel and Prisma are simpler while still following the original project requirements.

In short, this project uses React Router v7 with Remix features built in, which aligns with current best practices recommended by the React Router and Remix team.
---

## ⚙️ Prerequisites

Before you start, make sure you have installed:

- [Node.js](https://nodejs.org/) (>= 18.x recommended)
- [npm](https://www.npmjs.com/) (comes with Node)
- [Git](https://git-scm.com/) (for version control)
- A [Supabase](https://supabase.com/) project with:
  - Database
  - Supabase URL
  - Supabase Anon Key

---

## 📂 Project Structure

cms-edtech/
├── app/ # React Router routes
│ ├── routes/ # All app routes (articles, editor, auth)
│ ├── root.tsx # Root layout
├── prisma/ # Prisma schema & migrations
│ └── schema.prisma
├── public/ # Static assets
├── build/ # Generated build (after npm run build)
├── .env # Environment variables (not committed)
├── package.json
├── README.md


---

## ⚡ Getting Started

### 1. Clone the repo

```sh
git clone https://github.com/your-username/cms-edtech.git
cd cms-edtech

Install dependencies
npm install

3. Set up environment variables

Create a .env file in the project root:

DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@aws-1-us-east-2.pooler.supabase.com:5432/postgres"
SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SESSION_SECRET="your_random_session_secret"


⚠️ Replace placeholders with your Supabase project credentials.

🗄️ Database Setup

Generate Prisma client:

npx prisma generate


Push schema to database:

npx prisma db push


(Optional) Apply migrations if needed:

npx prisma migrate dev --name init

🖥️ Running Locally

Start the development server:

npm run dev


Visit: http://localhost:5173

📦 Build for Production
npm run build


The output will be inside the /build directory.

🌐 Deployment (Vercel)

Push your project to GitHub.

Go to Vercel Dashboard
.

Create a new project and import the repo.

Choose React Router as framework preset.

Add environment variables (from .env).

Deploy 🚀

🔄 Updating the Project

Code only changes: Push to GitHub → Vercel auto-deploys.

Database changes:

npx prisma migrate dev --name change_name
npx prisma migrate deploy
git push

📌 Notes

Ensure sslmode=require in your database connection string if Prisma fails to connect.

Use SESSION_SECRET with a secure random string (e.g., openssl rand -hex 32).

🧑‍💻 Author

Built by Daniel Nwachukwu ✨
Feel free to contribute, fork, or suggest improvements.
