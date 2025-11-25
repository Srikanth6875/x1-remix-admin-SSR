
import { redirect, useLoaderData } from "react-router";
import type { LoaderFunction, ActionFunction } from "react-router";
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

  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  const auth = new AuthService();
  const permission = await auth.checkUserPermission(userId, app_type!, run_type!);
  if (!permission) throw new Response("Forbidden", { status: 403 });

  const data = await ReflectionRegistry.executeReflectionEngine(permission.class_Name, permission.class_Method_Name, []);

  return {
    resellers: data as Reseller[],
  };
};


export const action: ActionFunction = async ({ request }) => {
  await requireUserSession(request);

  const formData = await request.formData();
  const url = new URL(request.url);
  const app_type = url.searchParams.get("app_type");
  const run_type = formData.get("run_type")?.toString();

  const action_type = formData.get("action_type");

  if (!run_type) throw new Response("Bad Request", { status: 400 });

  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const auth = new AuthService();

  const permission = await auth.checkUserPermission(userId, app_type!, run_type!);
  if (!permission) throw new Response("Forbidden", { status: 403 });

  if (action_type === "DELETE") {
    const deleteId = formData.get("delete_id");
    if (!deleteId) throw new Response("ID missing", { status: 400 });

    await ReflectionRegistry.executeReflectionEngine(permission.class_Name, permission.class_Method_Name, [Number(deleteId)]);
    return redirect("?app_type=RESELLER&run_type=GET_RESELLER");
  }

  const data: any = {};
  if (action_type === "UPDATE") {
    const id = formData.get("id");
    if (!id && !action_type) throw new Response("ID required", { status: 400 });
    data.id = Number(id);
  }

  formData.forEach((value, key) => {
    if (!["run_type", "app_type", "id", "action_type"].includes(key)) {
      const val = value.toString().trim();
      data[key] = isNaN(Number(val)) || val === "" ? val : Number(val);
    }
  });

  await ReflectionRegistry.executeReflectionEngine(permission.class_Name, permission.class_Method_Name, [data]);
  return redirect("?app_type=RESELLER&run_type=GET_RESELLER");
};


export default function ResellersPage() {
  const { resellers } = useLoaderData<{ resellers: Reseller[] }>();
  return <ResellerTable initialData={resellers} />;
}
