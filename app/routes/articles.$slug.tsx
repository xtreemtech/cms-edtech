import { LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData, Link } from 'react-router';
import { PrismaClient, Article } from '@prisma/client';

const prisma = new PrismaClient();

export async function loader({ params }: LoaderFunctionArgs) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
  });

  if (!article) {
    throw new Response('Not Found', { status: 404 });
  }

  return json({ article });
}

export default function ArticlePreview() {
  type LoaderData = {
    article: Article;
  };

  const { article } = useLoaderData<LoaderData>();

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/articles"
          className="inline-flex items-center text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Articles
        </Link>
      </div>

      <article className="prose lg:prose-xl">
        <h1>{article.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </article>
    </div>
  );
}
