// app/utils/db.server.ts
import { prisma } from './db';

export async function getArticles() {
  return prisma.article.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function getArticleBySlug(slug: string) {
  return prisma.article.findUnique({
    where: { slug }
  });
}

export async function createArticle(article: {
  title: string;
  slug: string;
  content: string;
  parentId?: string | null;
}) {
  return prisma.article.create({
    data: {
      title: article.title,
      slug: article.slug,
      content: article.content,
      parentId: article.parentId,
      status: 'draft' // Add default status
    }
  });
}

export async function updateArticle(id: string, article: {
  title?: string;
  slug?: string;
  content?: string;
  parentId?: string | null;
}) {
  return prisma.article.update({
    where: { id },
    data: {
      ...article,
      updatedAt: new Date() // Ensure updatedAt is set
    }
  });
}

export async function deleteArticle(id: string) {
  return prisma.article.delete({
    where: { id }
  });
}