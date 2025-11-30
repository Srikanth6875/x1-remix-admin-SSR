import { redirect, useLoaderData } from "react-router";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { ResellerTable } from "~/components/ResellerTable";
import type { Reseller } from "~/services/ResellerAppService.service";
import { ReflectionRegistry } from "~/shared-library/reflection-registry.service";
import { requireUserSession, sessionStorage } from "~/utils/session.service";
import { AuthService } from "~/user-auth/AuthService.service";
import { AppLayout } from "~/components/Layout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserSession(request);

  const url = new URL(request.url);
  const app_type = url.searchParams.get("app_type");
  const run_type = url.searchParams.get("run_type");
  const delete_id = url.searchParams.get("delete_id");

  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  const auth = new AuthService();
  const permission = await auth.checkUserPermission(userId, app_type!, run_type!);
  if (!permission) throw new Response("Forbidden", { status: 403 });

  // DELETE  LOADER
  if (delete_id) {
    await ReflectionRegistry.executeReflectionEngine(permission.class_Name, permission.class_Method_Name, [Number(delete_id)]);
    return redirect("/reflection?app_type=RESELLER&run_type=GET_RESELLER");
  }
  // NORMAL GET
  const data = await ReflectionRegistry.executeReflectionEngine(permission.class_Name, permission.class_Method_Name, []);
  return { resellers: data as Reseller[] };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireUserSession(request);

  const formData = await request.formData();
  const url = new URL(request.url);
  const app_type = url.searchParams.get("app_type");

  const run_type = formData.get("run_type")?.toString();

  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  const auth = new AuthService();
  const permission = await auth.checkUserPermission(userId, app_type!, run_type!);
  if (!permission) throw new Response("Forbidden", { status: 403 });

  // ADD OR UPDATE
  const data: Record<string, any> = {};
  const id = formData.get("id");
  if (id) data.id = Number(id); // update

  for (const [key, value] of formData.entries()) {
    if (["run_type", "app_type", "id"].includes(key)) continue;
    const val = value.toString().trim();
    data[key] = val === "" || isNaN(Number(val)) ? val : Number(val);
  }

  await ReflectionRegistry.executeReflectionEngine(permission.class_Name, permission.class_Method_Name, [data]);
  return redirect("/reflection?app_type=RESELLER&run_type=GET_RESELLER");
};

export default function ResellersPage() {
  const { resellers } = useLoaderData() as { resellers: Reseller[] };

  return (
    <AppLayout>
      <ResellerTable initialData={resellers} />
    </AppLayout>
  );
}
