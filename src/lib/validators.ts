import { z } from "zod";
import {
  DEPARTMENTS,
  PROGRAMMES,
  MAX_CUSTOM_INTEREST_LENGTH,
} from "@/lib/constants";

// ------------------------------------------------------------------
// Shared primitives
// ------------------------------------------------------------------

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address")
  .max(254);

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters")
  .regex(/[a-z]/, "Include at least one lowercase letter")
  .regex(/[A-Z]/, "Include at least one uppercase letter")
  .regex(/[0-9]/, "Include at least one number");

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Name is too short")
  .max(100, "Name is too long");

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s-]{7,20}$/, "Enter a valid phone number")
  .optional()
  .or(z.literal("").transform(() => undefined));

export const registrationNumberSchema = z
  .string()
  .trim()
  .min(3, "Registration number is too short")
  .max(30, "Registration number is too long");

const departmentSchema = z.enum(DEPARTMENTS, {
  errorMap: () => ({ message: "Select a department" }),
});

const programmeSchema = z.enum(PROGRAMMES, {
  errorMap: () => ({ message: "Select a programme" }),
});

const interestsSchema = z
  .array(z.string().trim().min(1).max(MAX_CUSTOM_INTEREST_LENGTH))
  .min(1, "Select at least one interest")
  .max(10, "Select at most 10 interests");

// ------------------------------------------------------------------
// Auth
// ------------------------------------------------------------------

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

const baseRegistration = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema,
  registrationNumber: registrationNumberSchema,
  department: departmentSchema,
  programme: programmeSchema,
  interests: interestsSchema,
});

export const mentorRegistrationSchema = baseRegistration.extend({
  role: z.literal("MENTOR"),
  yearOfStudy: z.coerce.number().int().min(2).max(6),
  strongModules: z
    .array(z.string().trim().min(1).max(80))
    .min(1, "Select at least one strong module")
    .max(8),
  hoursPerWeek: z.coerce.number().int().min(1).max(20),
  maxMentees: z.coerce.number().int().min(1).max(10),
  crossDepartment: z.boolean(),
});

export const menteeRegistrationSchema = baseRegistration.extend({
  role: z.literal("MENTEE"),
  sameDepartmentPreferred: z.boolean(),
});

export const registrationSchema = z.discriminatedUnion("role", [
  mentorRegistrationSchema,
  menteeRegistrationSchema,
]);

export type MentorRegistrationInput = z.infer<typeof mentorRegistrationSchema>;
export type MenteeRegistrationInput = z.infer<typeof menteeRegistrationSchema>;
export type RegistrationInput = z.infer<typeof registrationSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

// ------------------------------------------------------------------
// Profiles
// ------------------------------------------------------------------

export const profileUpdateSchema = z.object({
  name: nameSchema.optional(),
  phone: phoneSchema,
  interests: interestsSchema.optional(),
  // Mentor-only fields (ignored for mentees server-side)
  hoursPerWeek: z.coerce.number().int().min(1).max(20).optional(),
  maxMentees: z.coerce.number().int().min(1).max(10).optional(),
  crossDepartment: z.boolean().optional(),
  strongModules: z.array(z.string().trim().min(1).max(80)).max(8).optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

// ------------------------------------------------------------------
// Semesters
// ------------------------------------------------------------------

export const semesterSchema = z
  .object({
    name: z.string().trim().min(3).max(60),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
  })
  .refine((s) => s.endDate > s.startDate, {
    message: "End date must be after the start date",
    path: ["endDate"],
  });

export const semesterActionSchema = z.object({
  action: z.enum([
    "activate",
    "archive",
    "unarchive",
    "openRegistration",
    "closeRegistration",
  ]),
});

export type SemesterInput = z.infer<typeof semesterSchema>;

// ------------------------------------------------------------------
// Meetings
// ------------------------------------------------------------------

export const meetingLogSchema = z.object({
  pairingId: z.string().min(1),
  date: z.coerce.date(),
  durationMinutes: z.coerce.number().int().min(5).max(480),
  topics: z.string().trim().min(3, "Describe the topics discussed").max(500),
  notes: z.string().trim().max(2000).optional(),
});

export type MeetingLogInput = z.infer<typeof meetingLogSchema>;

// ------------------------------------------------------------------
// Messaging
// ------------------------------------------------------------------

export const messageSchema = z.object({
  recipientId: z.string().min(1),
  body: z.string().trim().min(1, "Message cannot be empty").max(4000),
});

export type MessageInput = z.infer<typeof messageSchema>;

// ------------------------------------------------------------------
// Announcements & bulk email
// ------------------------------------------------------------------

export const announcementSchema = z.object({
  title: z.string().trim().min(3).max(150),
  body: z.string().trim().min(3).max(5000),
  audience: z.enum(["ALL", "MENTORS", "MENTEES"]),
  sendEmail: z.boolean().default(false),
});

export type AnnouncementInput = z.infer<typeof announcementSchema>;

export const bulkEmailSchema = z.object({
  subject: z.string().trim().min(3).max(150),
  body: z.string().trim().min(3).max(10000),
  audience: z.enum(["ALL", "MENTORS", "MENTEES"]),
});

export type BulkEmailInput = z.infer<typeof bulkEmailSchema>;

// ------------------------------------------------------------------
// Admin actions
// ------------------------------------------------------------------

export const userDecisionSchema = z.object({
  action: z.enum(["approve", "reject"]),
});

export const manualPairingSchema = z.object({
  menteeProfileId: z.string().min(1),
  mentorProfileId: z.string().min(1),
});

export const reassignSchema = z.object({
  mentorProfileId: z.string().min(1),
});
