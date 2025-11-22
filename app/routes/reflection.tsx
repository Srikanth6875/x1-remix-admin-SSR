// import { useLoaderData } from "react-router";
// import type { LoaderFunction, ActionFunction } from "react-router";

// import { ResellerTable } from "~/components/ResellerTable";
// import type { Reseller } from "~/services/ResellerAppService.server";

// import { ReflectionRegistry } from "~/shared-library/reflection-registry.service";
// import { requireUserSession, sessionStorage } from "~/utils/session.service";
// import { AuthService } from "~/user-auth/AuthService.service";


// /* -------------------------------------
//    LOADER — Protected + Permission Check
// --------------------------------------*/
// export const loader: LoaderFunction = async ({ request }) => {
//   // Session check
//   const cookie = request.headers.get("Cookie");
//   const session = await sessionStorage.getSession(cookie);
//   await requireUserSession(request);

//   const userId = session.get("userId");

//   // Get app_type and run_type from request
//   const url = new URL(request.url);
//   const app_type = url.searchParams.get("app_type");
//   const run_type = url.searchParams.get("run_type");
//   const argsParam = url.searchParams.get("args");

//   if (!app_type || !run_type) {
//     throw new Response("Missing app_type or run_type", { status: 400 });
//   }

//   const args = argsParam ? JSON.parse(argsParam) : [];

//   // Permission validation
//   const auth = new AuthService();
//   const permission = await auth.checkUserPermission(userId, app_type, run_type);
//   if (!permission) {
//     throw new Response("Access Denied: No Permission", { status: 403 });
//   }

//   try {
//     const result = await ReflectionRegistry.executeReflectionEngine( permission.class_Name, permission.class_Method_Name, args );
//     return result;
//   } catch (err: any) {
//     console.error("[DynamicLoader] Error", err);
//     throw new Response(err.message || "Execution failed", { status: 500 });
//   }
// };


// /* -------------------------------------
//    ACTION — Protected + Permission Check
// --------------------------------------*/
// export const action: ActionFunction = async ({ request }) => {
//   // Session check
//   const cookie = request.headers.get("Cookie");
//   const session = await sessionStorage.getSession(cookie);
//   await requireUserSession(request);

//   const userId = session.get("userId");

//   const url = new URL(request.url);
//   const app_type = url.searchParams.get("app_type");
//   const run_type = url.searchParams.get("run_type");

//   if (!app_type || !run_type) {
//     throw new Response("Missing app_type or run_type", { status: 400 });
//   }

//   const formData = await request.formData();
//   const args = formData.get("args") ? JSON.parse(formData.get("args") as string) : [];

//   // Permission validation
//   const auth = new AuthService();

//   const permission = await auth.checkUserPermission(userId, app_type, run_type);
// // console.log("@@@@@@@@@@@@@", permission);

//   if (!permission) {
//     throw new Response("Access Denied: No Permission", { status: 403 });
//   }

//   try {
//     const result = await ReflectionRegistry.executeReflectionEngine(permission.class_Name, permission.class_Method_Name,args);
//     return result;
//   } catch (err: any) {
//     console.error("[DynamicAction] Error", err);
//     throw new Response(err.message || "Execution failed", { status: 500 });
//   }
// };


// /* -------------------------------------
//    COMPONENT → Render result dynamically
// --------------------------------------*/
// export default function DynamicPage() {
//   const data = useLoaderData<any>();
//   // Special case: Reseller list table
//   if (Array.isArray(data) && data.length > 0 && "id" in data[0]) {
//     return <ResellerTable initialData={data as Reseller[]} />;
//   }

//   return <pre>{JSON.stringify(data, null, 2)}</pre>;
// }

import { useLoaderData } from "react-router";
import type { LoaderFunction, ActionFunction } from "react-router";
import { redirect } from "react-router";

import { ResellerTable } from "~/components/ResellerTable";
import type { Reseller } from "~/services/ResellerAppService.server";

import { ReflectionRegistry } from "~/shared-library/reflection-registry.service";
import { requireUserSession, sessionStorage } from "~/utils/session.service";
import { AuthService } from "~/user-auth/AuthService.service";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserSession(request);

  const url = new URL(request.url);
  const app_type = url.searchParams.get("app_type");
  const run_type = url.searchParams.get("run_type");

  if (!app_type || !run_type) {
    throw new Response("Missing parameters", { status: 400 });
  }

  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  const auth = new AuthService();
  const permission = await auth.checkUserPermission(userId, app_type, run_type);
  if (!permission) throw new Response("Forbidden", { status: 403 });

  let args: any[] = [];

  if (run_type === "DELETE_RESELLER" || run_type === "UPDATE_RESELLER") {
    const id = url.searchParams.get("id");
    if (!id) throw new Response("ID required", { status: 400 });
    args = [Number(id)]; // ← Only pass the ID as number
  }

  // For list, create → no args or empty
  try {
    const result = await ReflectionRegistry.executeReflectionEngine(
      permission.class_Name,
      permission.class_Method_Name,
      args
    );
    return result;
  } catch (err: any) {
    console.error("[Loader Error]", err);
    throw new Response(err.message || "Failed", { status: 500 });
  }
};

export const action: ActionFunction = async ({ request }) => {
  await requireUserSession(request);

  const formData = await request.formData();
  const run_type = formData.get("run_type")?.toString();

  if (!run_type) throw new Response("Missing run_type", { status: 400 });

  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  const auth = new AuthService();
  const permission = await auth.checkUserPermission(userId, "RESELLER", run_type);
  if (!permission) throw new Response("Forbidden", { status: 403 });

  let args: any[] = [];

  if (run_type === "DELETE_RESELLER") {
    const id = formData.get("id");
    if (!id) throw new Response("ID required", { status: 400 });
    args = [Number(id)]; // ← Only pass the number!
  }

  else if (run_type === "ADD_RESELLER") {
    const data: any = {};
    formData.forEach((value, key) => {
      if (!["app_type", "run_type"].includes(key)) {
        const val = value.toString();
        data[key] = isNaN(Number(val)) ? val : Number(val);
      }
    });
    args = [data]; // ← Full object for create
  }

  else if (run_type === "UPDATE_RESELLER") {
    const id = formData.get("id");
    if (!id) throw new Response("ID required", { status: 400 });

    const data: any = { id: Number(id) };
    formData.forEach((value, key) => {
      if (!["app_type", "run_type", "id"].includes(key)) {
        const val = value.toString();
        data[key] = isNaN(Number(val)) ? val : Number(val);
      }
    });
    args = [data]; // ← Full object with id for update
  }

  try {
    await ReflectionRegistry.executeReflectionEngine(
      permission.class_Name,
      permission.class_Method_Name,
      args
    );

    return redirect("?app_type=RESELLER&run_type=GET_RESELLER");
  } catch (err: any) {
    console.error("[Action Error]", err);
    throw new Response(err.message || "Operation failed", { status: 500 });
  }
};

export default function DynamicPage() {
  const data = useLoaderData<any>();

  if (Array.isArray(data) && data.length > 0 && "id" in data[0]) {
    return <ResellerTable initialData={data as Reseller[]} />;
  }

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}