// app/routes/articles.tsx
import { useLoaderData } from "react-router";
import { requireUserSession } from "../utils/session.server";
import ArticlesList from "../components/ArticlesList";
import { getArticles } from "../utils/db.server";

export async function loader({ request }: { request: Request }) {
  await requireUserSession(request);
  const articles = await getArticles();
  
  return new Response(JSON.stringify({ articles }), {
    headers: { "Content-Type": "application/json" },
  });
}

export default function ArticlesPage() {
  const { articles } = useLoaderData<{ articles: any[] }>();
  return <ArticlesList articles={articles} />;
}