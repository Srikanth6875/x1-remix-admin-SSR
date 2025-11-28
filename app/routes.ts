import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
  // Home page (will redirect to dashboard if logged in)
  index("routes/home.tsx"),
  {
    path: "/login",
    file: "routes/login.tsx",
  },
  {
    path: "/reflection",
    file: "routes/reflection.tsx",
  },
  {
    path: "/logout",
    file: "routes/logout.tsx",
  },
] satisfies RouteConfig;
