// app/components/TreeView.tsx
import { useState } from "react";
import { Link, useParams } from "react-router";
import type { Article } from "@prisma/client";

interface TreeViewProps {
  articles: Article[];
  parentId?: string | null;
  level?: number;
}

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const FolderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 4.24 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z"/>
  </svg>
);

const FileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);

export default function TreeView({ articles, parentId = null, level = 0 }: TreeViewProps) {
  const { slug } = useParams();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleNode = (id: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedNodes(newExpanded);
  };

  const children = articles.filter((article) => article.parentId === parentId);

  if (children.length === 0 && level === 0) {
    return (
      <div className="p-4 text-gray-500 text-sm">
        No articles yet. <Link to="/editor/new" className="text-blue-600 hover:underline">Create your first article</Link>
      </div>
    );
  }

  if (children.length === 0) return null;

  return (
    <ul className={level > 0 ? 'pl-4' : ''}>
      {children.map((article) => {
        const hasChildren = articles.some((a) => a.parentId === article.id);
        const isExpanded = expandedNodes.has(article.id);
        const isSelected = slug === article.slug;

        return (
          <li key={article.id} className="my-1">
            <div className="flex items-center group">
              {hasChildren && (
                <button
                  onClick={() => toggleNode(article.id)}
                  className="mr-1 w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
                </button>
              )}
              {!hasChildren && <span className="w-6" />}

              <Link
                to={`/editor/${article.slug}`}
                className={`flex-1 p-2 rounded-xl flex items-center gap-2 transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white font-medium shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                } ${hasChildren ? 'font-semibold' : 'font-normal'}`}
              >
                {hasChildren ? <FolderIcon /> : <FileIcon />}
                <span className="truncate">{article.title}</span>
              </Link>
            </div>

            {hasChildren && isExpanded && (
              <TreeView
                articles={articles}
                parentId={article.id}
                level={level + 1}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}