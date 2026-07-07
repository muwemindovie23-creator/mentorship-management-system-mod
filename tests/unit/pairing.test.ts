import { describe, expect, it } from "vitest";
import {
  rankMentors,
  type MenteeForPairing,
  type MentorCandidate,
} from "@/lib/pairing";

function mentor(overrides: Partial<MentorCandidate> = {}): MentorCandidate {
  return {
    id: "mentor-1",
    department: "Civil Engineering",
    crossDepartment: true,
    hoursPerWeek: 3,
    maxMentees: 3,
    activeMentees: 0,
    interestIds: [],
    ...overrides,
  };
}

function mentee(overrides: Partial<MenteeForPairing> = {}): MenteeForPairing {
  return {
    id: "mentee-1",
    department: "Civil Engineering",
    sameDepartmentPreferred: false,
    interestIds: [],
    ...overrides,
  };
}

describe("rankMentors", () => {
  it("returns null when no mentors are available", () => {
    expect(rankMentors(mentee(), [])).toBeNull();
  });

  it("never selects a mentor at full capacity", () => {
    const full = mentor({ id: "full", maxMentees: 2, activeMentees: 2 });
    expect(rankMentors(mentee(), [full])).toBeNull();
  });

  it("enforces same-department when the mentee requests it", () => {
    const otherDept = mentor({
      id: "other",
      department: "Mechanical Engineering",
    });
    const sameDept = mentor({ id: "same", department: "Civil Engineering" });

    const result = rankMentors(mentee({ sameDepartmentPreferred: true }), [
      otherDept,
      sameDept,
    ]);
    expect(result?.mentor.id).toBe("same");

    const none = rankMentors(mentee({ sameDepartmentPreferred: true }), [
      otherDept,
    ]);
    expect(none).toBeNull();
  });

  it("excludes mentors who do not accept other departments", () => {
    const strict = mentor({
      id: "strict",
      department: "Mechanical Engineering",
      crossDepartment: false,
    });
    expect(rankMentors(mentee(), [strict])).toBeNull();

    // ...but they are eligible for their own department.
    const sameDeptMentee = mentee({ department: "Mechanical Engineering" });
    expect(rankMentors(sameDeptMentee, [strict])?.mentor.id).toBe("strict");
  });

  it("prefers same department over shared interests", () => {
    const sameDept = mentor({ id: "same-dept" });
    const sharedInterests = mentor({
      id: "shared",
      department: "Mechanical Engineering",
      interestIds: ["i1", "i2", "i3"],
    });

    const result = rankMentors(
      mentee({ interestIds: ["i1", "i2", "i3"] }),
      [sameDept, sharedInterests]
    );
    expect(result?.mentor.id).toBe("same-dept");
  });

  it("prefers more shared interests within the same department", () => {
    const oneShared = mentor({ id: "one", interestIds: ["i1"] });
    const twoShared = mentor({ id: "two", interestIds: ["i1", "i2"] });

    const result = rankMentors(
      mentee({ interestIds: ["i1", "i2"] }),
      [oneShared, twoShared]
    );
    expect(result?.mentor.id).toBe("two");
  });

  it("uses availability as a tie-breaker", () => {
    const lowAvail = mentor({ id: "low", hoursPerWeek: 1 });
    const highAvail = mentor({ id: "high", hoursPerWeek: 8 });

    const result = rankMentors(mentee(), [lowAvail, highAvail]);
    expect(result?.mentor.id).toBe("high");
  });

  it("breaks exact ties randomly among top candidates", () => {
    const a = mentor({ id: "a" });
    const b = mentor({ id: "b" });

    const first = rankMentors(mentee(), [a, b], () => 0);
    const second = rankMentors(mentee(), [a, b], () => 0.99);

    expect(first?.mentor.id).toBe("a");
    expect(second?.mentor.id).toBe("b");
  });

  it("counts free slots toward the score", () => {
    const nearlyFull = mentor({ id: "nearly", maxMentees: 3, activeMentees: 2 });
    const empty = mentor({ id: "empty", maxMentees: 3, activeMentees: 0 });

    const result = rankMentors(mentee(), [nearlyFull, empty]);
    expect(result?.mentor.id).toBe("empty");
  });
});
