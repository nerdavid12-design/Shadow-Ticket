import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--cream)" }}>
      <header
        style={{
          backgroundColor: "var(--cream)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          className="mx-auto flex items-center justify-between"
          style={{ maxWidth: 1100, padding: "0 2.5rem", height: "3.75rem" }}
        >
          <Link
            href="/dashboard"
            className="font-display"
            style={{
              fontSize: "1.25rem",
              fontStyle: "italic",
              fontWeight: 400,
              color: "var(--ink)",
              textDecoration: "none",
              letterSpacing: "0.01em",
            }}
          >
            Shadow Tixs
          </Link>
          <LogoutButton />
        </div>
      </header>
      <main
        className="mx-auto"
        style={{ maxWidth: 1100, padding: "3rem 2.5rem 5rem" }}
      >
        {children}
      </main>
    </div>
  );
}
