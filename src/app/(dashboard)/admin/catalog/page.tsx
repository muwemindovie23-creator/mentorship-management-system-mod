import { db } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { CatalogSection } from "@/components/admin/catalog-section";

export const metadata = { title: "Departments & programmes" };
export const dynamic = "force-dynamic";

export default async function AdminCatalogPage() {
  const [departments, programmes, interests] = await Promise.all([
    db.department.findMany({ orderBy: { name: "asc" } }),
    db.programme.findMany({ orderBy: { name: "asc" } }),
    db.interest.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <>
      <PageHeader
        title="Departments & programmes"
        description="Control what mentors and mentees can pick during registration. Deactivating an item hides it from new sign-ups only — students already registered with it keep their existing record unchanged."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <CatalogSection
          title="Departments"
          description="Shown on the registration form's department picker."
          addPlaceholder="Add a new department…"
          apiBase="/api/admin/departments"
          items={departments}
        />
        <CatalogSection
          title="Programmes"
          description="Shown on the registration form's programme picker."
          addPlaceholder="Add a new programme…"
          apiBase="/api/admin/programmes"
          items={programmes}
        />
        <CatalogSection
          title="Interests"
          description="Shown as quick-pick chips alongside free-text custom interests."
          addPlaceholder="Add a new interest…"
          apiBase="/api/admin/interests"
          items={interests}
        />
      </div>
    </>
  );
}
