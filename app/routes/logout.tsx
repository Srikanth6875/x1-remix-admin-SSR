import type { ActionFunction, LoaderFunction } from "react-router";
import { logoutSession } from "~/utils/session.service";

// Support both POST and direct browser GET
export const action: ActionFunction = async ({ request }) => {
  return logoutSession(request);
};

export const loader: LoaderFunction = async ({ request }) => {
  return logoutSession(request);
};

export default function Logout() {
  return null;
}
