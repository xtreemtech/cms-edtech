import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router";
import type { Article } from "@prisma/client";

// SVG Icons
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);
const ChevronUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
  </svg>
);
const DoubleChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
  </svg>
);
const DoubleChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
  </svg>
);
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

// Utility function to format relative time
const formatRelativeTime = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (diffInSeconds < 60) return "less than a minute ago";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  return `${years} year${years === 1 ? "" : "s"} ago`;
};

interface ArticlesListProps {
  articles: Article[];
}

type SortKey = "title" | "createdAt" | "updatedAt";
type SortDirection = "asc" | "desc";

export default function ArticlesList({ articles }: ArticlesListProps) {
  const [filterText, setFilterText] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [sortBy, setSortBy] = useState<SortKey>("updatedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const getDueStatus = (createdAt: Date) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 30) {
      return { text: "Past Due", color: "text-red-600", date: created.toLocaleDateString() };
    }
    const daysUntilDue = 30 - diffDays;
    return { text: `in ${daysUntilDue} days`, color: "text-yellow-600", date: created.toLocaleDateString() };
  };

  const getCategoryBadge = (categoryType: string | null | undefined) => {
    const categoryConfig = {
      IEP: { color: "bg-purple-100 text-purple-800", text: "IEP" },
      EOA: { color: "bg-green-100 text-green-800", text: "EOA" },
      MLP: { color: "bg-blue-100 text-blue-800", text: "MLP" },
      ALP: { color: "bg-orange-100 text-orange-800", text: "ALP" },
      "504": { color: "bg-red-100 text-red-800", text: "504" },
    };

    const config = categoryConfig[
      categoryType as keyof typeof categoryConfig
    ] || { color: "bg-gray-100 text-gray-800", text: "None" };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        ● {config.text}
      </span>
    );
  };

  const getStatusBadge = (status: string = "draft") => {
    const statusConfig = {
      draft: { text: "Draft", color: "bg-green-100 text-green-800" },
      active: { text: "Active", color: "bg-blue-100 text-blue-800" },
      amendment: { text: "Amendment", color: "bg-yellow-100 text-yellow-800" },
      upcoming: { text: "Upcoming", color: "bg-purple-100 text-purple-800" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        ● {config.text}
      </span>
    );
  };

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortDirection("asc");
    }
  };

  const { filteredArticles, statusCounts, categoryLookup } =
    useMemo(() => {
      const categoryMap = new Map<string, string>();
      articles.forEach((article) => {
        if (article.parentId) {
          const parent = articles.find((a) => a.id === article.parentId);
          if (parent) {
            categoryMap.set(article.id, parent.title);
          }
        }
      });

      const counts = articles.reduce(
        (acc, article) => {
          const status = article.status || "draft";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      let filtered = articles.filter((article) => {
        const matchesText =
          article.title.toLowerCase().includes(filterText.toLowerCase()) ||
          article.content.toLowerCase().includes(filterText.toLowerCase()) ||
          (categoryMap.get(article.id)?.toLowerCase() || '').includes(filterText.toLowerCase());

        const matchesTab =
          activeTab === "All" ||
          article.status?.toLowerCase() === activeTab.toLowerCase();

        return matchesText && matchesTab;
      });

      filtered.sort((a, b) => {
        if (sortBy === "title") {
          if (a.title < b.title) {
            return sortDirection === "asc" ? -1 : 1;
          }
          if (a.title > b.title) {
            return sortDirection === "asc" ? 1 : -1;
          }
          return 0;
        } else {
          const aDate = new Date(a[sortBy] as Date).getTime();
          const bDate = new Date(b[sortBy] as Date).getTime();
          if (aDate < bDate) {
            return sortDirection === "asc" ? -1 : 1;
          }
          if (aDate > bDate) {
            return sortDirection === "asc" ? 1 : -1;
          }
          return 0;
        }
      });

      return {
        filteredArticles: filtered,
        statusCounts: counts,
        categoryLookup: categoryMap,
      };
    }, [articles, filterText, activeTab, sortBy, sortDirection]);

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredArticles]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Articles</h1>
        <Link
          to="/editor/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
        >
          + New Article
        </Link>
      </div>

      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {["All", "Upcoming", "Draft", "Amendment", "Active"].map((tab) => {
          const count =
            tab === "All"
              ? articles.length
              : statusCounts[tab.toLowerCase()] || 0;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Filter by title or category..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 mb-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("title")}>
                <div className="flex items-center">
                  Title
                  {sortBy === "title" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </span>
                  )}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("createdAt")}>
                <div className="flex items-center">
                  Date
                  {sortBy === "createdAt" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </span>
                  )}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("updatedAt")}>
                <div className="flex items-center">
                  Updated
                  {sortBy === "updatedAt" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </span>
                  )}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedArticles.length > 0 ? (
              paginatedArticles.map((article) => {
                const dueStatus = getDueStatus(article.createdAt);
                const categoryName = categoryLookup.get(article.id);
                const lastUpdatedText = formatRelativeTime(article.updatedAt);

                return (
                  <tr key={article.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{article.title}</div>
                      <div className="text-sm text-gray-500 truncate">{article.content.replace(/<[^>]*>/g, '').substring(0, 50)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${dueStatus.color}`}>{dueStatus.text}</div>
                      <div className="text-sm text-gray-500">{dueStatus.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        Last Update: {lastUpdatedText}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getCategoryBadge(categoryName)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(article.status || "draft")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/editor/${article.slug}`}
                        className="px-4 py-2 text-sm font-medium rounded-full bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                      >
                        Edit Draft
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-10">
                  No articles match your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center py-4">
        <div className="text-sm text-gray-700">
          {filteredArticles.length} Records
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-700">
          <span>Records per page</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="p-1 border border-gray-300 rounded-lg"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="ml-4">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            <DoubleChevronLeftIcon />
          </button>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeftIcon />
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRightIcon />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            <DoubleChevronRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
