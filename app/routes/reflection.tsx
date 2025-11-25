// routes/resellers.tsx (or .tsx file)
import { redirect, useLoaderData } from "react-router";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { ResellerTable } from "~/components/ResellerTable";
import type { Reseller } from "~/services/ResellerAppService.server";
import { ReflectionRegistry } from "~/shared-library/reflection-registry.service";
import { requireUserSession, sessionStorage } from "~/utils/session.service";
import { AuthService } from "~/user-auth/AuthService.service";
import { AppLayout } from "~/components/Layout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserSession(request);

  const url = new URL(request.url);
  const app_type = url.searchParams.get("app_type") ?? "RESELLER";
  const run_type = url.searchParams.get("run_type") ?? "GET_RESELLER";

  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  const auth = new AuthService();
  const permission = await auth.checkUserPermission(userId, app_type, run_type);
  if (!permission) throw new Response("Forbidden", { status: 403 });

  const data = await ReflectionRegistry.executeReflectionEngine(
    permission.class_Name,
    permission.class_Method_Name,
    []
  );

  return {
    resellers: data as Reseller[],
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireUserSession(request);

  const formData = await request.formData();
  const url = new URL(request.url);
  const app_type = url.searchParams.get("app_type") ?? "RESELLER";
  const action_type = formData.get("action_type")?.toString();
  const run_type = formData.get("run_type")?.toString() ?? "GET_RESELLER";

  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const auth = new AuthService();

  const permission = await auth.checkUserPermission(userId, app_type, run_type);
  if (!permission) throw new Response("Forbidden", { status: 403 });

  if (action_type === "DELETE") {
    const deleteId = formData.get("delete_id");
    if (!deleteId) throw new Response("ID missing", { status: 400 });

    await ReflectionRegistry.executeReflectionEngine(
      permission.class_Name,
      permission.class_Method_Name,
      [Number(deleteId)]
    );
    return redirect("/resellers?app_type=RESELLER&run_type=GET_RESELLER");
  }

  // UPDATE or CREATE
  const data: Record<string, any> = {};

  if (action_type === "UPDATE") {
    const id = formData.get("id");
    if (!id) throw new Response("ID required for update", { status: 400 });
    data.id = Number(id);
  }

  for (const [key, value] of formData.entries()) {
    if (["run_type", "app_type", "id", "action_type", "delete_id"].includes(key)) continue;

    const val = value.toString().trim();
    data[key] = val === "" || isNaN(Number(val)) ? val : Number(val);
  }

  await ReflectionRegistry.executeReflectionEngine(
    permission.class_Name,
    permission.class_Method_Name,
    [data]
  );

  return redirect("/resellers?app_type=RESELLER&run_type=GET_RESELLER");
};

export default function ResellersPage() {
  const { resellers } = useLoaderData() as { resellers: Reseller[] };

  return (
    <AppLayout>
      <ResellerTable initialData={resellers} />
    </AppLayout>
  );
}