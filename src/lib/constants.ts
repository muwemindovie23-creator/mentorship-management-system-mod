export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME ?? "Menty";

export const DEPARTMENTS = [
  "Civil Department",
  "Mechanical Department",
  "Electrical Department",
  "Mining Department",
] as const;

export const PROGRAMMES = [
  "BSc Civil Engineering Structures",
  "BSc Civil Engineering Water",
  "BSc Civil Engineering Transport",
  "BSc Mechanical Engineering",
  "BSc Energy Engineering", 
  "BSc Automobile Engineering",
  "BSc Industrial Engineering",
  "BSc Electrical & Electronics Engineering",
  "BSc Biomedical Engineering",
  "BSc Electronics & Computer Engineering",
  "BSc Electronics & Telecommunications Engineering",
  "BSc Metallurgy & Mineral Processing Engineering",
  "BSc Mining Engineering",
  "BSc Geogical Engineering",
] as const;

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
