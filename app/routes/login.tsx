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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              X1 Admin
            </h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {data?.error && (
            <div className="rounded-xl bg-red-50 p-3 border border-red-200 mb-6">
              <div className="flex items-center justify-center">
                <svg className="h-4 w-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium text-red-800">{data.error}</p>
              </div>
            </div>
          )}

          <Form method="post" className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 placeholder-gray-400"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 placeholder-gray-400"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-300 font-bold focus:outline-none focus:ring-4 focus:ring-purple-200"
            >
              Sign In
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}