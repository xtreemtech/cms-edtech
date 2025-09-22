// app/utils/session.server.ts
import { createCookieSessionStorage, redirect } from 'react-router'

const sessionSecret = process.env.SESSION_SECRET || 'fallback-secret-change-in-production'

const storage = createCookieSessionStorage({
  cookie: {
    name: 'cms-session',
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
  },
})

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession()
  session.set('userId', userId)
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  })
}

export async function getUserSession(request: Request) {
  const session = await storage.getSession(request.headers.get('Cookie'))
  const userId = session.get('userId')
  return userId
}

export async function requireUserSession(request: Request, redirectTo: string = '/auth/login') {
  const userId = await getUserSession(request)
  if (!userId) {
    throw redirect(redirectTo)
  }
  return userId
}

export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get('Cookie'))
  return redirect('/auth/login', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  })
}