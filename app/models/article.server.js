// app/models/article.server.js
import { prisma } from '~/db.server';

export async function getArticles() {
  return prisma.article.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function getArticleBySlug(slug) {
  return prisma.article.findUnique({
    where: { slug }
  });
}

export async function createArticle(article) {
  return prisma.article.create({
    data: article
  });
}

export async function updateArticle(id, article) {
  return prisma.article.update({
    where: { id },
    data: article
  });
}

export async function deleteArticle(id) {
  return prisma.article.delete({
    where: { id }
  });
}