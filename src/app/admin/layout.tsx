import type { ReactNode } from "react";
import { isAdmin } from "@/lib/auth";
import { AdminLogin } from "@/components/admin/login";
import { AdminNav } from "@/components/admin/nav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const ok = await isAdmin();
  if (!ok) return <AdminLogin />;
  return (
    <div className="min-h-screen flex bg-slate-100">
      <AdminNav />
      <main className="flex-1 p-6 md:p-10 overflow-x-auto">{children}</main>
    </div>
  );
}
