export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME ?? "Menty";

// Departments and programmes moved to the Department/Programme tables
// (admin-managed via /admin/catalog) — see prisma/migrations/
// 20260804000000_catalog_tables, which seeds them with these same
// values so existing deployments keep working unchanged.

export const STRONG_MODULES = [
  "College Algebra",
  "Engineering Drawing",
  "Structural Analysis",
  "Fluid Mechanics",
  "Thermodynamics",
  "Computer Aided Design",
  "Calculus",
  "Programming for engineers",
  "Control Systems",
  "Materials Science",
  "Soil Mechanics",
  "Surveying",
  "Statics and Dynamics",
] as const;

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
