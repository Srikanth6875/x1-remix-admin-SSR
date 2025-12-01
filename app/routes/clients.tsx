import { redirect, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { ClientsTable } from "~/components/ClientsTable";
import { ReflectionRegistry } from "~/shared-library/reflection-registry.service";
import { requireUserSession, sessionStorage } from "~/utils/session.service";
import { AuthService } from "~/user-auth/AuthService.service";
import { AppLayout } from "~/components/Layout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    await requireUserSession(request);
    const { app_type, run_type } = getParams(request, ["app_type", "run_type",]);
    const { class_Name, class_Method_Name, } = await getUserPermission(request, app_type!, run_type!);

    const data = await ReflectionRegistry.executeReflectionEngine(class_Name, class_Method_Name, []);
    return { clients: data };
};

function getParams(request: Request, keys: string[]) {
    const url = new URL(request.url);
    const params: Record<string, string | null> = {};
    keys.forEach(key => { params[key] = url.searchParams.get(key) });

    return params;
}

async function getUserPermission(request: Request, app_type: string, run_type: string) {
    const auth = new AuthService();
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    const userId = session.get("userId");

    const permission = await auth.checkUserPermission(userId, app_type, run_type);
    if (!permission) throw new Response("Forbidden", { status: 403 });
    return permission;
}

export default function ClientsPage() {
    const { clients } = useLoaderData<{ clients: any }>();
    const columns = [
        { key: "client_id", label: "Client ID" },
        { key: "client_name", label: "Client Name" },
        { key: "client_dealer_id", label: "Client Dealer ID" },
        { key: "client_inactive", label: "Status" },
        { key: "client_assets_deleted", label: "Delete Assets" },
        { key: "client_disable_process_flag", label: "Disable Process" },
    ];

    return (
        <AppLayout>
            <ClientsTable initialData={clients} columns={columns} />
        </AppLayout>
    );
}
