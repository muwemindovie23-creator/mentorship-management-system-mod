-- AlterTable
ALTER TABLE "Interest" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Programme" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Programme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Programme_name_key" ON "Programme"("name");

-- Seed: carry over the values that used to be hardcoded so existing
-- registration flows keep working unchanged. MentorProfile/MenteeProfile
-- department & programme columns stay plain text — no relation was
-- added — so nothing about already-registered students changes here.
INSERT INTO "Department" ("id", "name") VALUES
    ('dept_civil', 'Civil Department'),
    ('dept_mechanical', 'Mechanical Department'),
    ('dept_electrical', 'Electrical Department'),
    ('dept_mining', 'Mining Department');

INSERT INTO "Programme" ("id", "name") VALUES
    ('prog_civil_structures', 'BSc Civil Engineering Structures'),
    ('prog_civil_water', 'BSc Civil Engineering Water'),
    ('prog_civil_transport', 'BSc Civil Engineering Transport'),
    ('prog_mechanical', 'BSc Mechanical Engineering'),
    ('prog_energy', 'BSc Energy Engineering'),
    ('prog_automobile', 'BSc Automobile Engineering'),
    ('prog_industrial', 'BSc Industrial Engineering'),
    ('prog_electrical_electronics', 'BSc Electrical & Electronics Engineering'),
    ('prog_biomedical', 'BSc Biomedical Engineering'),
    ('prog_electronics_computer', 'BSc Electronics & Computer Engineering'),
    ('prog_electronics_telecom', 'BSc Electronics & Telecommunications Engineering'),
    ('prog_metallurgy', 'BSc Metallurgy & Mineral Processing Engineering'),
    ('prog_mining', 'BSc Mining Engineering'),
    ('prog_geological', 'BSc Geogical Engineering');
