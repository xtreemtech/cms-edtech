import { supabase } from '../utils/supabase.server'
import { createUserSession } from '../utils/session.server'

const LogoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <line x1="10" y1="9" x2="8" y2="9"/>
  </svg>
);

export async function action({ request }: { request: Request }) {
  const formData = await request.formData()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (data.user) {
      return await createUserSession(data.user.id, '/')
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Login failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-md w-full max-h-full overflow-y-auto border border-gray-100">
        <div className="text-center">
          <div className="inline-block p-3 rounded-full bg-blue-600 text-white mb-4">
            <LogoIcon />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <a href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </a>
          </p>
        </div>

        <form className="mt-8 space-y-6" method="post">
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Email address"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Password"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="mt-6 p-4 rounded-xl bg-slate-100 border border-slate-200 text-sm text-slate-700">
          <p className="font-semibold mb-1">Temporary Test Credentials:</p>
          <p>
            <span className="font-medium">Email:</span> <code className="font-mono">biyibo1755@anysilo.com</code>
          </p>
          <p>
            <span className="font-medium">Password:</span> <code className="font-mono">Pass@123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
