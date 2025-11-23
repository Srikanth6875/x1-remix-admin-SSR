import { createCookieSessionStorage, redirect } from "react-router";
const SESSION_TIMEOUT_MS = 60 * 60 * 1000; 

export const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "user_session",
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: false, // set true in production
        secrets: ["ATAMAI@AI#BOTS"],
    },
});

// Load current session
export async function getSession(request: Request) {
    return sessionStorage.getSession(request.headers.get("Cookie"));
}

// Create session after login
export async function createUserSession(userId: number, redirectTo: string) {
    const session = await sessionStorage.getSession();
    session.set("userId", userId);
    session.set("lastActivity", Date.now()); // track first activity

    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session),
        },
    });
}

// Requires session + applies inactivity timeout logic
export async function requireUserSession(request: Request) {
    const session = await getSession(request);
    const userId = session.get("userId");
    const lastActivity = session.get("lastActivity") as number | undefined;
    const now = Date.now();

    // Not logged in at all
    if (!userId) throw redirect("/login");

    // If no activity for 2 min → kill session
    if (lastActivity && now - lastActivity > SESSION_TIMEOUT_MS) {
        throw redirect("/login", {
            headers: {
                "Set-Cookie": await sessionStorage.destroySession(session),
            },
        });
    }
    // Update last activity timestamp
    session.set("lastActivity", now);
    return session;
}


// Destroy session on logout
export async function logoutSession(request: Request) {
    const session = await sessionStorage.getSession(
        request.headers.get("Cookie")
    );

    return redirect("/login", {
        headers: {
            "Set-Cookie": await sessionStorage.destroySession(session),
        },
    });
}
