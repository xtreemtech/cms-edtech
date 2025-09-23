import type { Article } from '@prisma/client';

interface ArticlePreviewProps {
  article: Article;
  onClose: () => void;
}

export default function ArticlePreview({ article, onClose }: ArticlePreviewProps) {
  const handleEdit = () => {
    window.location.href = `/editor/${article.slug}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Preview: {article.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            aria-label="Close preview"
          >
            ×
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="prose max-w-none">
            <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
            <div 
              dangerouslySetInnerHTML={{ __html: article.content }} 
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Close Preview
          </button>
          <button
            onClick={handleEdit}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Edit Article
          </button>
        </div>
      </div>
    </div>
  );
}