// ─── Helpers ───────────────────────────────────────────────────────────────

function parseAnalysisResponse(raw: string) {
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

function formatPhone(phone: string): string {
  return phone.startsWith("0") ? "254" + phone.slice(1) : phone;
}

function scoreColor(score: number): string {
  if (score >= 70) return "green";
  if (score >= 45) return "amber";
  return "red";
}

function isFreeAnalysisAvailable(analysesUsed: number): boolean {
  return analysesUsed === 0;
}

function requiresPayment(
  analysesUsed: number,
  analysesPaid: number,
  paid: boolean,
): boolean {
  return analysesUsed >= 1 && !paid && analysesPaid === 0;
}

function isValidCV(text: string): boolean {
  return text.trim().length >= 50;
}

// ─── Tests ─────────────────────────────────────────────────────────────────

describe("parseAnalysisResponse", () => {
  it("parses clean JSON correctly", () => {
    const raw = JSON.stringify({
      ats_score: 80,
      match_score: 75,
      readability_score: 90,
      missing_keywords: ["React", "Docker"],
      found_keywords: ["Python", "SQL"],
      rewritten_summary: "A skilled developer...",
      weak_sections: "Work experience needs more detail.",
      interview_tips: "Prepare for technical interviews.",
    });
    const result = parseAnalysisResponse(raw);
    expect(result.ats_score).toBe(80);
    expect(result.match_score).toBe(75);
    expect(result.missing_keywords).toContain("React");
  });

  it("strips markdown code fences before parsing", () => {
    const raw =
      '```json\n{"ats_score":70,"match_score":60,"readability_score":80,"missing_keywords":[],"found_keywords":[],"rewritten_summary":"","weak_sections":"","interview_tips":""}\n```';
    const result = parseAnalysisResponse(raw);
    expect(result.ats_score).toBe(70);
  });

  it("throws on invalid JSON", () => {
    expect(() => parseAnalysisResponse("not valid json")).toThrow();
  });
});

describe("formatPhone", () => {
  it("converts 07XX to 2547XX", () => {
    expect(formatPhone("0712345678")).toBe("254712345678");
  });

  it("leaves 2547XX unchanged", () => {
    expect(formatPhone("254712345678")).toBe("254712345678");
  });

  it("handles 01XX numbers", () => {
    expect(formatPhone("0112345678")).toBe("254112345678");
  });
});

describe("scoreColor", () => {
  it("returns green for scores >= 70", () => {
    expect(scoreColor(70)).toBe("green");
    expect(scoreColor(100)).toBe("green");
    expect(scoreColor(85)).toBe("green");
  });

  it("returns amber for scores between 45 and 69", () => {
    expect(scoreColor(45)).toBe("amber");
    expect(scoreColor(60)).toBe("amber");
    expect(scoreColor(69)).toBe("amber");
  });

  it("returns red for scores below 45", () => {
    expect(scoreColor(0)).toBe("red");
    expect(scoreColor(44)).toBe("red");
    expect(scoreColor(20)).toBe("red");
  });
});

describe("isFreeAnalysisAvailable", () => {
  it("returns true when user has never analyzed", () => {
    expect(isFreeAnalysisAvailable(0)).toBe(true);
  });

  it("returns false when user has already analyzed", () => {
    expect(isFreeAnalysisAvailable(1)).toBe(false);
    expect(isFreeAnalysisAvailable(3)).toBe(false);
  });
});

describe("requiresPayment", () => {
  it("requires payment after free analysis used", () => {
    expect(requiresPayment(1, 0, false)).toBe(true);
  });

  it("does not require payment on first analysis", () => {
    expect(requiresPayment(0, 0, false)).toBe(false);
  });

  it("does not require payment if user has paid analyses", () => {
    expect(requiresPayment(2, 1, false)).toBe(false);
  });

  it("does not require payment if paid flag is true", () => {
    expect(requiresPayment(1, 0, true)).toBe(false);
  });
});

describe("isValidCV", () => {
  it("returns false for empty string", () => {
    expect(isValidCV("")).toBe(false);
  });

  it("returns false for text under 50 characters", () => {
    expect(isValidCV("Too short")).toBe(false);
  });

  it("returns true for text over 50 characters", () => {
    expect(isValidCV("A".repeat(51))).toBe(true);
  });

  it("returns false for whitespace only", () => {
    expect(isValidCV("   ")).toBe(false);
  });
});
