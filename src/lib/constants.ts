export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME ?? "Engineering Mentorship";

export const DEPARTMENTS = [
  "Civil Engineering",
  "Mechanical Engineering",
  "Electrical & Electronic Engineering",
  "Chemical & Process Engineering",
  "Computer & Software Engineering",
  "Agricultural & Biosystems Engineering",
  "Geospatial & Surveying Engineering",
] as const;

export const PROGRAMMES = [
  "BSc Civil Engineering",
  "BSc Mechanical Engineering",
  "BSc Electrical Engineering",
  "BSc Chemical Engineering",
  "BSc Computer Engineering",
  "BSc Software Engineering",
  "BSc Mechatronics Engineering",
  "BSc Agricultural Engineering",
  "BSc Geospatial Engineering",
] as const;

export const STRONG_MODULES = [
  "Engineering Mathematics",
  "Engineering Drawing",
  "Structural Analysis",
  "Fluid Mechanics",
  "Thermodynamics",
  "Circuit Theory",
  "Digital Electronics",
  "Programming & Data Structures",
  "Control Systems",
  "Materials Science",
  "Soil Mechanics",
  "Surveying",
  "Chemical Process Principles",
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
