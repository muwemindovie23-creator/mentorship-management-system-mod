export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME ?? "Menty";

// Departments, programmes and strong modules moved to the
// Department/Programme/StrongModule tables (admin-managed via
// /admin/catalog) — see prisma/migrations/20260804000000_catalog_tables
// and 20260804010000_strong_modules, which seed them with these same
// values so existing deployments keep working unchanged.

export const PREDEFINED_INTERESTS = [
  "Football",
  "Basketball",
  "Music",
  "Gaming",
  "Robotics",
  "Photography",
  "Reading",
  "Hiking",
  "Volunteering",
  "Entrepreneurship",
  "Chess",
  "Debate",
  "Art & Design",
  "Cooking",
  "Fitness",
] as const;

export const YEARS_OF_STUDY = [2, 3, 4, 5] as const;

export const MAX_CUSTOM_INTEREST_LENGTH = 40;
