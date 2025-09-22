// app/routes.ts
import { type RouteConfig } from "@react-router/dev/routes";
import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("articles", "routes/articles.tsx"),
  route("editor/:slug", "routes/editor.$slug.tsx"),
  route("auth/login", "routes/auth.login.tsx"),
  route("auth/signup", "routes/auth.signup.tsx"),
  route("auth/logout", "routes/auth.logout.tsx"),
] satisfies RouteConfig;