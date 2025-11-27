import { useLoaderData, redirect } from "react-router";
import type { LoaderFunction, ActionFunction } from "react-router";
import { ResellerAppService, type Reseller } from "~/services/ResellerAppService.service";
import { ResellerTable } from "~/static-approach-com-bkp/ResellerTable";
import { requireUserSession } from "~/utils/session.service";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserSession(request);
  const service = new ResellerAppService();
  const resellers: Reseller[] = await service.ResellerList();
  return resellers;
};

export const action: ActionFunction = async ({ request }) => {
  const service = new ResellerAppService();

  const form = await request.formData();
  const method = form.get("_method")?.toString();

  const id = form.get("id") ? Number(form.get("id")) : undefined;
  const name = form.get("name") as string;
  const email = form.get("email")?.toString() || null;
  const companyName = form.get("companyName")?.toString() || null;
  const resellerType = form.get("resellerType")?.toString() || null;
  const status = form.get("status") as string;
  const address = form.get("address")?.toString() || null;

  try {
    if (method === "post") {
      await service.CreateReseller({ name, email, companyName, resellerType, status, address, });
    }
    else if (method === "put" && id) {
      await service.UpdateReseller({ id, name, email, companyName, resellerType, status, address, });
    }
    else if (method === "delete" && id) {
      await service.DeleteReseller(id);
    }
  } catch (error) {
    console.error("Action failed:", error);
  }

  return redirect("/");
};

export default function Home() {
  const resellers = useLoaderData<Reseller[]>();
  return <ResellerTable initialData={resellers} />;
}
