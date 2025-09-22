// app/routes/auth.logout.tsx
import { logout } from '../utils/session.server';

export async function action({ request }: { request: Request }) {
  return logout(request);
}

export default function Logout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Signing out...</h2>
          <p className="mt-2 text-gray-600">Please wait while we sign you out.</p>
        </div>
      </div>
    </div>
  );
}