import { redirect, useLoaderData } from "react-router";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { ResellerTable } from "~/components/ResellerTable";
import type { Reseller } from "~/services/ResellerAppService.service";
import { ReflectionRegistry } from "~/shared-library/reflection-registry.service";
import { requireUserSession, sessionStorage } from "~/utils/session.service";
import { AuthService } from "~/user-auth/AuthService.service";
import { AppLayout } from "~/components/Layout";

const auth = new AuthService();

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserSession(request);
  const { app_type, run_type, delete_id } = getParams(request, ["app_type", "run_type", "delete_id",]);

  const { class_Name, class_Method_Name, } = await getUserPermission(request, app_type!, run_type!);
  // DELETE CASE
  if (delete_id) {
    await ReflectionRegistry.executeReflectionEngine(class_Name, class_Method_Name, [Number(delete_id)]);
    return redirect("/reflection?app_type=RESELLER&run_type=GET_RESELLER");
  }

  const data = await ReflectionRegistry.executeReflectionEngine(class_Name, class_Method_Name, []);
  return { resellers: data as Reseller[] };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireUserSession(request);

  const formData = await request.formData();
  const { app_type } = getParams(request, ["app_type"]);
  const run_type = formData.get("run_type")?.toString();
  const { class_Name, class_Method_Name, } = await getUserPermission(request, app_type!, run_type!);

  // ADD OR UPDATE
  const data: Record<string, any> = {};
  const id = formData.get("id");
  if (id) data.id = Number(id);

  for (const [key, value] of formData.entries()) {
    if (["run_type", "app_type", "id"].includes(key)) continue;

    const val = value.toString().trim();
    data[key] = val === "" || isNaN(Number(val)) ? val : Number(val);
  }

  await ReflectionRegistry.executeReflectionEngine(class_Name, class_Method_Name, [data]);
  return redirect("/reflection?app_type=RESELLER&run_type=GET_RESELLER");
};

function getParams(request: Request, keys: string[]) {
  const url = new URL(request.url);
  const params: Record<string, string | null> = {};
  keys.forEach(key => { params[key] = url.searchParams.get(key); });
  return params;
}

async function getUserPermission(request: Request, app_type: string, run_type: string) {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  const permission = await auth.checkUserPermission(userId, app_type, run_type);
  if (!permission) throw new Response("Forbidden", { status: 403 });
  return permission;
}

export default function ResellersPage() {
  const { resellers } = useLoaderData() as { resellers: Reseller[] };

  return (
    <AppLayout>
      <ResellerTable initialData={resellers} />
    </AppLayout>
  );
}
