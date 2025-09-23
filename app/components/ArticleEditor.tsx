import { useState, useEffect } from 'react';
import { useNavigation, useFetcher, Link } from 'react-router';
import type { Article } from '@prisma/client';
import RichTextEditor from './RichTextEditor';

interface ArticleEditorProps {
  article?: Article;
  allArticles?: Article[];
}

export default function ArticleEditor({ article, allArticles = [] }: ArticleEditorProps) {
  const [title, setTitle] = useState(article?.title || '');
  const [slug, setSlug] = useState(article?.slug || '');
  const [content, setContent] = useState(article?.content || '');
  const [parentId, setParentId] = useState(article?.parentId || '');
  const [isManualSlugEdit, setIsManualSlugEdit] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const navigation = useNavigation();
  const fetcher = useFetcher();
  
  const isSubmitting = navigation.state === 'submitting' || fetcher.state === 'submitting';
  
  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setSlug(article.slug);
      setContent(article.content);
      setParentId(article.parentId || '');
      setIsManualSlugEdit(true);
    }
  }, [article]);

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const formatTitleCase = (text: string): string => {
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    if (!isManualSlugEdit) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSlug = generateSlug(e.target.value);
    setSlug(newSlug);
    setIsManualSlugEdit(true);
  };

  const resetSlugToAuto = () => {
    const autoSlug = generateSlug(title);
    setSlug(autoSlug);
    setIsManualSlugEdit(false);
  };

  const topLevelCategories = allArticles.filter(a => !a.parentId && a.id !== article?.id);

  return (
    <>
      <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
        {/* Mobile Header for back and preview */}
        <div className="md:hidden flex items-center justify-between mb-6">
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
          {article && (
            <button
              onClick={() => setShowPreviewModal(true)}
              className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Preview
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </button>
          )}
        </div>

        <fetcher.Form method="post" className="space-y-6 md:space-y-8">
          <input type="hidden" name="id" value={article?.id || ''} />
          <input type="hidden" name="content" value={content} />
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={handleTitleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
              placeholder="Enter article title"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
              <label className="block text-sm font-semibold text-gray-700">Slug</label>
              {isManualSlugEdit && (
                <button
                  type="button"
                  onClick={resetSlugToAuto}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Reset to auto-generate
                </button>
              )}
            </div>
            <input
              type="text"
              name="slug"
              value={slug}
              onChange={handleSlugChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
              placeholder="article-slug"
            />
            <p className="text-sm text-gray-500 font-medium">
              URL: /articles/{slug || 'article-slug'}
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Parent Category</label>
            <select
              name="parentId"
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">None (Top Level Category)</option>
              {topLevelCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {formatTitleCase(category.title)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Content</label>
            <RichTextEditor
              content={content}
              onChange={setContent}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              name="action"
              value={article ? "update" : "create"}
              disabled={isSubmitting}
              className="flex-grow inline-flex items-center justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Saving..." : (article ? "Update Article" : "Create Article")}
            </button>
            
            {article && (
              <button
                type="submit"
                name="action"
                value="delete"
                disabled={isSubmitting}
                className="flex-grow inline-flex items-center justify-center py-3 px-6 border border-red-300 shadow-sm text-sm font-semibold rounded-xl text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? "Deleting..." : "Delete Article"}
              </button>
            )}
            
            <Link
              to="/articles"
              className="flex-grow inline-flex items-center justify-center py-3 px-6 border border-gray-300 shadow-sm text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </Link>

            {article && (
              <button
                onClick={() => setShowPreviewModal(true)}
                type="button"
                className="hidden sm:inline-flex items-center justify-center py-3 px-6 border border-gray-300 shadow-sm text-sm font-semibold rounded-xl text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Preview
              </button>
            )}
          </div>
        </fetcher.Form>
      </div>

      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-end p-4">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 md:p-6 lg:p-8 overflow-y-auto">
              <article className="prose lg:prose-xl">
                <h1 className="text-3xl font-bold">{title}</h1>
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </article>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
