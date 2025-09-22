// app/root.tsx
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { useLoaderData } from "react-router";
import Navigation from "./components/Navigation";
import { getUserSession } from "./utils/session.server";
import "./styles/index.css";

export async function loader({ request }: { request: Request }) {
  const userId = await getUserSession(request);
  return { isAuthenticated: !!userId };
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { isAuthenticated } = useLoaderData<typeof loader>();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation isAuthenticated={isAuthenticated} />
      <Outlet />
    </div>
  );
}