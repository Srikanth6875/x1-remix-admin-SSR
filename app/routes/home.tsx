import type { LoaderFunction } from "react-router";
import { redirect } from "react-router";
import { requireUserSession } from "~/utils/session.service";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserSession(request);
  return redirect("/reseller");
};
