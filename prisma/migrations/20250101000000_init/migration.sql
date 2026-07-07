-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MENTOR', 'MENTEE');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PairingStatus" AS ENUM ('ACTIVE', 'ENDED');

-- CreateEnum
CREATE TYPE "Audience" AS ENUM ('ALL', 'MENTORS', 'MENTEES');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('WAITLIST', 'APPROVAL', 'PAIRING', 'SYSTEM');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING',
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Semester" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "registrationOpen" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Semester_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "yearOfStudy" INTEGER NOT NULL,
    "programme" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "strongModules" TEXT[],
    "hoursPerWeek" INTEGER NOT NULL,
    "maxMentees" INTEGER NOT NULL DEFAULT 3,
    "crossDepartment" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MentorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenteeProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "programme" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "sameDepartmentPreferred" BOOLEAN NOT NULL DEFAULT false,
    "waitlisted" BOOLEAN NOT NULL DEFAULT false,
    "waitlistedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenteeProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Interest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorInterest" (
    "mentorProfileId" TEXT NOT NULL,
    "interestId" TEXT NOT NULL,

    CONSTRAINT "MentorInterest_pkey" PRIMARY KEY ("mentorProfileId","interestId")
);

-- CreateTable
CREATE TABLE "MenteeInterest" (
    "menteeProfileId" TEXT NOT NULL,
    "interestId" TEXT NOT NULL,

    CONSTRAINT "MenteeInterest_pkey" PRIMARY KEY ("menteeProfileId","interestId")
);

-- CreateTable
CREATE TABLE "Pairing" (
    "id" TEXT NOT NULL,
    "mentorProfileId" TEXT NOT NULL,
    "menteeProfileId" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "status" "PairingStatus" NOT NULL DEFAULT 'ACTIVE',
    "matchScore" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "Pairing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meeting" (
    "id" TEXT NOT NULL,
    "pairingId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "topics" TEXT NOT NULL,
    "notes" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "audience" "Audience" NOT NULL DEFAULT 'ALL',
    "semesterId" TEXT,
    "createdById" TEXT NOT NULL,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_status_idx" ON "User"("role", "status");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Semester_name_key" ON "Semester"("name");

-- CreateIndex
CREATE INDEX "Semester_isActive_idx" ON "Semester"("isActive");

-- CreateIndex
CREATE INDEX "Semester_isArchived_idx" ON "Semester"("isArchived");

-- CreateIndex
CREATE UNIQUE INDEX "MentorProfile_userId_key" ON "MentorProfile"("userId");

-- CreateIndex
CREATE INDEX "MentorProfile_semesterId_idx" ON "MentorProfile"("semesterId");

-- CreateIndex
CREATE INDEX "MentorProfile_department_idx" ON "MentorProfile"("department");

-- CreateIndex
CREATE UNIQUE INDEX "MentorProfile_registrationNumber_semesterId_key" ON "MentorProfile"("registrationNumber", "semesterId");

-- CreateIndex
CREATE UNIQUE INDEX "MenteeProfile_userId_key" ON "MenteeProfile"("userId");

-- CreateIndex
CREATE INDEX "MenteeProfile_semesterId_idx" ON "MenteeProfile"("semesterId");

-- CreateIndex
CREATE INDEX "MenteeProfile_department_idx" ON "MenteeProfile"("department");

-- CreateIndex
CREATE INDEX "MenteeProfile_waitlisted_idx" ON "MenteeProfile"("waitlisted");

-- CreateIndex
CREATE UNIQUE INDEX "MenteeProfile_registrationNumber_semesterId_key" ON "MenteeProfile"("registrationNumber", "semesterId");

-- CreateIndex
CREATE UNIQUE INDEX "Interest_name_key" ON "Interest"("name");

-- CreateIndex
CREATE INDEX "MentorInterest_interestId_idx" ON "MentorInterest"("interestId");

-- CreateIndex
CREATE INDEX "MenteeInterest_interestId_idx" ON "MenteeInterest"("interestId");

-- CreateIndex
CREATE INDEX "Pairing_mentorProfileId_status_idx" ON "Pairing"("mentorProfileId", "status");

-- CreateIndex
CREATE INDEX "Pairing_menteeProfileId_status_idx" ON "Pairing"("menteeProfileId", "status");

-- CreateIndex
CREATE INDEX "Pairing_semesterId_status_idx" ON "Pairing"("semesterId", "status");

-- CreateIndex
CREATE INDEX "Meeting_pairingId_idx" ON "Meeting"("pairingId");

-- CreateIndex
CREATE INDEX "Meeting_date_idx" ON "Meeting"("date");

-- CreateIndex
CREATE INDEX "Message_senderId_recipientId_createdAt_idx" ON "Message"("senderId", "recipientId", "createdAt");

-- CreateIndex
CREATE INDEX "Message_recipientId_readAt_idx" ON "Message"("recipientId", "readAt");

-- CreateIndex
CREATE INDEX "Announcement_audience_createdAt_idx" ON "Announcement"("audience", "createdAt");

-- CreateIndex
CREATE INDEX "Announcement_semesterId_idx" ON "Announcement"("semesterId");

-- CreateIndex
CREATE INDEX "Notification_userId_readAt_idx" ON "Notification"("userId", "readAt");

-- AddForeignKey
ALTER TABLE "MentorProfile" ADD CONSTRAINT "MentorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorProfile" ADD CONSTRAINT "MentorProfile_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenteeProfile" ADD CONSTRAINT "MenteeProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenteeProfile" ADD CONSTRAINT "MenteeProfile_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorInterest" ADD CONSTRAINT "MentorInterest_mentorProfileId_fkey" FOREIGN KEY ("mentorProfileId") REFERENCES "MentorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorInterest" ADD CONSTRAINT "MentorInterest_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "Interest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenteeInterest" ADD CONSTRAINT "MenteeInterest_menteeProfileId_fkey" FOREIGN KEY ("menteeProfileId") REFERENCES "MenteeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenteeInterest" ADD CONSTRAINT "MenteeInterest_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "Interest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pairing" ADD CONSTRAINT "Pairing_mentorProfileId_fkey" FOREIGN KEY ("mentorProfileId") REFERENCES "MentorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pairing" ADD CONSTRAINT "Pairing_menteeProfileId_fkey" FOREIGN KEY ("menteeProfileId") REFERENCES "MenteeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pairing" ADD CONSTRAINT "Pairing_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_pairingId_fkey" FOREIGN KEY ("pairingId") REFERENCES "Pairing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Constraint: mentor capacity and durations must be positive
ALTER TABLE "MentorProfile" ADD CONSTRAINT "MentorProfile_maxMentees_positive" CHECK ("maxMentees" > 0);
ALTER TABLE "MentorProfile" ADD CONSTRAINT "MentorProfile_hoursPerWeek_positive" CHECK ("hoursPerWeek" > 0);
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_duration_positive" CHECK ("durationMinutes" > 0);

-- Constraint: a mentee can have at most one ACTIVE pairing
CREATE UNIQUE INDEX "Pairing_one_active_per_mentee" ON "Pairing"("menteeProfileId") WHERE "status" = 'ACTIVE';
