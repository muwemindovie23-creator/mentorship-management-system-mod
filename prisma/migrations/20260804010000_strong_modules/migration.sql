-- CreateTable
CREATE TABLE "StrongModule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StrongModule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StrongModule_name_key" ON "StrongModule"("name");

-- Seed: carry over the values that used to be hardcoded so existing
-- registration flows keep working unchanged. MentorProfile.strongModules
-- stays plain text — no relation was added — so nothing about
-- already-registered mentors changes here.
INSERT INTO "StrongModule" ("id", "name") VALUES
    ('mod_college_algebra', 'College Algebra'),
    ('mod_engineering_drawing', 'Engineering Drawing'),
    ('mod_structural_analysis', 'Structural Analysis'),
    ('mod_fluid_mechanics', 'Fluid Mechanics'),
    ('mod_thermodynamics', 'Thermodynamics'),
    ('mod_computer_aided_design', 'Computer Aided Design'),
    ('mod_calculus', 'Calculus'),
    ('mod_programming_for_engineers', 'Programming for engineers'),
    ('mod_control_systems', 'Control Systems'),
    ('mod_materials_science', 'Materials Science'),
    ('mod_soil_mechanics', 'Soil Mechanics'),
    ('mod_surveying', 'Surveying'),
    ('mod_statics_and_dynamics', 'Statics and Dynamics');
