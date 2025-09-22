import { useState, useEffect } from 'react';
import { useNavigation, useFetcher, Link } from 'react-router';
import type { Article } from '@prisma/client';
import RichTextEditor from './RichTextEditor';

interface ArticleEditorProps {
  article?: Article;
  allArticles?: Article[];
}

const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const PreviewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.2 12C4.16 8.5 7.74 6 12 6s7.84 2.5 9.8 6c-1.96 3.5-5.54 6-9.8 6S4.16 15.5 2.2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default function ArticleEditor({ article, allArticles = [] }: ArticleEditorProps) {
  const [title, setTitle] = useState(article?.title || '');
  const [slug, setSlug] = useState(article?.slug || '');
  const [content, setContent] = useState(article?.content || '');
  const [parentId, setParentId] = useState(article?.parentId || '');
  const [isManualSlugEdit, setIsManualSlugEdit] = useState(false);
  const navigation = useNavigation();
  const fetcher = useFetcher();
  
  const isSubmitting = navigation.state === 'submitting';
  
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
    <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6 md:hidden">
        <Link
          to="/articles"
          className="inline-flex items-center text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
        >
          <BackIcon />
          Back to Articles
        </Link>
        {article && (
          <Link
            to={`/articles/${article.slug}`}
            className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <PreviewIcon />
            Preview
          </Link>
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
            URL: /editor/{slug || 'article-slug'}
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
            placeholder="Write your article content here..."
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
          
          {article && (
            <Link
              to={`/articles/${article.slug}`}
              className="flex-grow hidden md:inline-flex items-center justify-center py-3 px-6 border border-gray-300 shadow-sm text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              <PreviewIcon />
              Preview
            </Link>
          )}

          <Link
            to="/articles"
            className="flex-grow inline-flex items-center justify-center py-3 px-6 border border-gray-300 shadow-sm text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </fetcher.Form>
    </div>
  );
}
