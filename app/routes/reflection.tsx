import { useLoaderData } from "react-router";
import type { LoaderFunction, ActionFunction } from "react-router";

import { ResellerTable } from "~/components/ResellerTable";
import type { Reseller } from "~/services/ResellerAppService.server";

import { ReflectionRegistry } from "~/shared-library/reflection-registry.service";
import { requireUserSession, sessionStorage } from "~/utils/session.service";
import { AuthService } from "~/user-auth/AuthService.service";


/* -------------------------------------
   LOADER — Protected + Permission Check
--------------------------------------*/
export const loader: LoaderFunction = async ({ request }) => {
  // Session check
  const cookie = request.headers.get("Cookie");
  const session = await sessionStorage.getSession(cookie);
  await requireUserSession(request);

  const userId = session.get("userId");

  // Get app_type and run_type from request
  const url = new URL(request.url);
  const app_type = url.searchParams.get("app_type");
  const run_type = url.searchParams.get("run_type");
  const argsParam = url.searchParams.get("args");

  if (!app_type || !run_type) {
    throw new Response("Missing app_type or run_type", { status: 400 });
  }

  const args = argsParam ? JSON.parse(argsParam) : [];

  // Permission validation
  const auth = new AuthService();
  const permission = await auth.checkUserPermission(userId, app_type, run_type);
  if (!permission) {
    throw new Response("Access Denied: No Permission", { status: 403 });
  }

  try {
    const result = await ReflectionRegistry.executeReflectionEngine( permission.class_Name, permission.class_Method_Name, args );
    return result;
  } catch (err: any) {
    console.error("[DynamicLoader] Error", err);
    throw new Response(err.message || "Execution failed", { status: 500 });
  }
};


/* -------------------------------------
   ACTION — Protected + Permission Check
--------------------------------------*/
export const action: ActionFunction = async ({ request }) => {
  // Session check
  const cookie = request.headers.get("Cookie");
  const session = await sessionStorage.getSession(cookie);
  await requireUserSession(request);

  const userId = session.get("userId");

  const url = new URL(request.url);
  const app_type = url.searchParams.get("app_type");
  const run_type = url.searchParams.get("run_type");

  if (!app_type || !run_type) {
    throw new Response("Missing app_type or run_type", { status: 400 });
  }

  const formData = await request.formData();
  const args = formData.get("args") ? JSON.parse(formData.get("args") as string) : [];

  // Permission validation
  const auth = new AuthService();
  
  const permission = await auth.checkUserPermission(userId, app_type, run_type);
// console.log("@@@@@@@@@@@@@", permission);

  if (!permission) {
    throw new Response("Access Denied: No Permission", { status: 403 });
  }

  try {
    const result = await ReflectionRegistry.executeReflectionEngine(permission.class_Name, permission.class_Method_Name,args);
    return result;
  } catch (err: any) {
    console.error("[DynamicAction] Error", err);
    throw new Response(err.message || "Execution failed", { status: 500 });
  }
};


/* -------------------------------------
   COMPONENT → Render result dynamically
--------------------------------------*/
export default function DynamicPage() {
  const data = useLoaderData<any>();
  // Special case: Reseller list table
  if (Array.isArray(data) && data.length > 0 && "id" in data[0]) {
    return <ResellerTable initialData={data as Reseller[]} />;
  }

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
