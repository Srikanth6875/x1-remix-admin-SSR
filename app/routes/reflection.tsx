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
  const run_type = url.searchParams.get("run_type") || "GET_RESELLER";
  const id = url.searchParams.get("id");
  const editId = url.searchParams.get("editId");

  if (!app_type) throw new Response("Bad Request", { status: 400 });

  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const auth = new AuthService();

  // Handle DELETE via URL
  if (run_type === "DELETE_RESELLER" && id) {
    const permission = await auth.checkUserPermission(userId, app_type, run_type);
    if (!permission) throw new Response("Forbidden", { status: 403 });

    await ReflectionRegistry.executeReflectionEngine(permission.class_Name, permission.class_Method_Name, [Number(id)]);

    // Clean URL + reload fresh list
    throw redirect("?app_type=RESELLER&run_type=GET_RESELLER");
  }

  // Always load fresh list
  const permission = await auth.checkUserPermission(userId, app_type, "GET_RESELLER");
  if (!permission) throw new Response("Forbidden", { status: 403 });

  const data = await ReflectionRegistry.executeReflectionEngine(
    permission.class_Name,
    permission.class_Method_Name,
    []
  );

  return {
    resellers: data as Reseller[],
    editId: editId ? Number(editId) : null,
  };
};

export const action: ActionFunction = async ({ request }) => {
  await requireUserSession(request);

  const formData = await request.formData();
  const run_type = formData.get("run_type")?.toString();

  if (!run_type || !["ADD_RESELLER", "UPDATE_RESELLER"].includes(run_type)) {
    throw new Response("Invalid action", { status: 400 });
  }

  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const auth = new AuthService();

  const permission = await auth.checkUserPermission(userId, "RESELLER", run_type);
  if (!permission) throw new Response("Forbidden", { status: 403 });

  const data: any = {};
  if (run_type === "UPDATE_RESELLER") {
    const id = formData.get("id");
    if (!id) throw new Response("ID required", { status: 400 });
    data.id = Number(id);
  }

  formData.forEach((value, key) => {
    if (!["run_type", "app_type", "id"].includes(key)) {
      const val = value.toString().trim();
      data[key] = isNaN(Number(val)) || val === "" ? val : Number(val);
    }
  });

  await ReflectionRegistry.executeReflectionEngine(permission.class_Name, permission.class_Method_Name, [data]);

  // Always redirect to clean list URL → forces fresh loader
  return redirect("?app_type=RESELLER&run_type=GET_RESELLER");
};

export default function ResellersPage() {
  const { resellers } = useLoaderData<{ resellers: Reseller[]; editId: number | null }>();

  return (
    <ResellerTable initialData={resellers} />
  );
}