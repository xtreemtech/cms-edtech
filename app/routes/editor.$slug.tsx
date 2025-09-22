// app/routes/editor.$slug.tsx
import { useLoaderData, redirect, Link } from "react-router";
import { useState, useEffect } from "react";
import TreeView from "../components/TreeView";
import ArticleEditor from "../components/ArticleEditor";
import ArticlePreview from '../components/ArticlePreview';
import { requireUserSession } from "../utils/session.server";
import {
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../utils/db.server";

// SVG Icons
const NewArticleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

const ViewAllIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM6 10a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zM5 13a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" />
  </svg>
);

const BackArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const PreviewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

interface LoaderData {
  articles: any[];
  article: any;
}

export async function loader({ request, params }: { request: Request; params: { slug: string } }) {
  await requireUserSession(request);
  
  const articles = await getArticles();
  const article = params.slug !== "new" ? await getArticleBySlug(params.slug) : null;
  
  return { articles, article };
}

export async function action({ request }: { request: Request }) {
  await requireUserSession(request);
  
  const formData = await request.formData();
  const actionType = formData.get("action");
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;
  const parentId = formData.get("parentId") as string | null;

  try {
    switch (actionType) {
      case "create":
        const article = await createArticle({
          title,
          slug,
          content,
          parentId: parentId || null,
        });
        return redirect(`/editor/${article.slug}`);
      
      case "update":
        await updateArticle(id, {
          title,
          slug,
          content,
          parentId: parentId || null,
        });
        return redirect(`/editor/${slug}`);
      
      case "delete":
        await deleteArticle(id);
        return redirect("/articles");
      
      default:
        throw new Error("Invalid action type");
    }
  } catch (error) {
    console.error("Action error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export default function EditorPage() {
  const loaderData = useLoaderData() as LoaderData;
  const [showPreview, setShowPreview] = useState(false);
  const [data, setData] = useState<LoaderData>({ articles: [], article: null });

  useEffect(() => {
    if (typeof loaderData === 'string') {
      try {
        setData(JSON.parse(loaderData));
      } catch {
        setData({ articles: [], article: null });
      }
    } else {
      setData(loaderData);
    }
  }, [loaderData]);

  const { articles, article } = data;

  if (!articles) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-100 p-6 overflow-y-auto shadow-lg">
        <div className="flex flex-col space-y-4 mb-6">
          <Link
            to="/editor/new"
            className="flex items-center justify-center w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors shadow-md"
          >
            <NewArticleIcon />
            New Article
          </Link>
          <Link
            to="/articles"
            className="flex items-center justify-center w-full bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <ViewAllIcon />
            View All Articles
          </Link>
        </div>
        
        <h2 className="text-xl font-bold text-gray-800 mb-4">Articles</h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <TreeView articles={articles} />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {article ? `Editing: ${article.title}` : 'Create New Article'}
            </h1>
            {article?.updatedAt && (
              <p className="text-sm text-gray-500 mt-1">
                Last updated: {new Date(article.updatedAt).toLocaleDateString()}
              </p>
            )}
          </div>
          
          <div className="flex space-x-3">
            {article && (
              <button
                onClick={() => setShowPreview(true)}
                className="flex items-center bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700 transition-colors font-medium shadow-md"
                type="button"
              >
                <PreviewIcon />
                Preview
              </button>
            )}
            <Link
              to="/articles"
              className="flex items-center bg-gray-100 text-gray-700 px-5 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              <BackArrowIcon />
              Back to List
            </Link>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-3xl shadow-lg p-6 min-h-full">
            <ArticleEditor article={article} allArticles={articles} />
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && article && (
        <ArticlePreview 
          article={article} 
          onClose={() => setShowPreview(false)} 
        />
      )}
    </div>
  );
}