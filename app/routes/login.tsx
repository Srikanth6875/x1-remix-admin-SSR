import { Form, useActionData, redirect } from "react-router";
import type { ActionFunction, LoaderFunction } from "react-router";
import { AuthService } from "~/user-auth/AuthService.service";
import { createUserSession, getSession } from "~/utils/session.service";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  if (session.get("userId")) return redirect("/reseller");
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get("email")?.toString() || "";
  const password = form.get("password")?.toString() || "";

  const auth = new AuthService();
  const user = await auth.validateLogin(email, password);
  // console.log("user,", user);

  if (!user) {
    return { error: "Invalid email or password" };
  }

  return createUserSession(user.id, "/reseller");
};

export default function Login() {
  const data = useActionData<{ error?: string }>();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Login
          </h2>
        </div>

        {data?.error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{data.error}</p>
          </div>
        )}

        <Form method="post" className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login
          </button>
        </Form>
      </div>
    </div>
  );
}