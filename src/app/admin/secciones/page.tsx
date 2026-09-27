import { getConfig } from "@/lib/settings";
import { SectionsEditor } from "@/components/admin/sections-editor";

export default async function AdminSections() {
  const config = await getConfig();
  return <SectionsEditor initial={config} />;
}
