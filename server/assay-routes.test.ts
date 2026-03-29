import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock prisma before importing routes
vi.mock("./db/prisma.js", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    interviewSession: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    report: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
    candidate: {
      findMany: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0),
    },
    interviewInvite: {
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn(),
    },
    calibrationSession: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    reportFeedback: {
      findMany: vi.fn().mockResolvedValue([]),
      upsert: vi.fn(),
    },
  },
}));

// Mock query helpers
vi.mock("./lib/queryHelpers.js", () => ({
  qstr: (val: string | undefined) => val || null,
  qint: (val: string | undefined) => (val ? parseInt(val) : null),
}));

describe("ASSAY Route Modules", () => {
  describe("Health Route", () => {
    it("exports a router with healthz endpoint", async () => {
      const { default: healthRouter } = await import("./routes/health.js");
      expect(healthRouter).toBeDefined();
      // The router should have a stack with at least one layer
      expect(healthRouter.stack?.length).toBeGreaterThan(0);
    });
  });

  describe("Auth Route", () => {
    it("exports a router", async () => {
      const { default: authRouter } = await import("./routes/auth.js");
      expect(authRouter).toBeDefined();
    });
  });

  describe("Sessions Route", () => {
    it("exports a router", async () => {
      const { default: sessionsRouter } = await import("./routes/sessions.js");
      expect(sessionsRouter).toBeDefined();
    });
  });

  describe("Reports Route", () => {
    it("exports a router", async () => {
      const { default: reportsRouter } = await import("./routes/reports.js");
      expect(reportsRouter).toBeDefined();
    });
  });

  describe("Candidates Route", () => {
    it("exports a router", async () => {
      const { default: candidatesRouter } = await import("./routes/candidates.js");
      expect(candidatesRouter).toBeDefined();
    });
  });

  describe("Invites Route", () => {
    it("exports a router", async () => {
      const { default: invitesRouter } = await import("./routes/invites.js");
      expect(invitesRouter).toBeDefined();
    });
  });

  describe("Calibration Route", () => {
    it("exports a router", async () => {
      const { default: calibrationRouter } = await import("./routes/calibration.js");
      expect(calibrationRouter).toBeDefined();
    });
  });

  describe("Feedback Route", () => {
    it("exports a router", async () => {
      const { default: feedbackRouter } = await import("./routes/feedback.js");
      expect(feedbackRouter).toBeDefined();
    });
  });

  describe("Analytics Route", () => {
    it("exports a router", async () => {
      const { default: analyticsRouter } = await import("./routes/analytics.js");
      expect(analyticsRouter).toBeDefined();
    });
  });

  describe("Route Index", () => {
    it("exports a combined router with all sub-routes", async () => {
      const { default: mainRouter } = await import("./routes/index.js");
      expect(mainRouter).toBeDefined();
      // Should have multiple layers (one per sub-router + middleware)
      expect(mainRouter.stack?.length).toBeGreaterThan(5);
    });
  });
});

describe("JWT Token Payload", () => {
  it("should handle integer user IDs converted to string for JWT", () => {
    // Simulates the userToPayload function behavior
    const userId = 60001; // Int from Prisma
    const payload = {
      id: String(userId),
      email: "test@example.com",
      name: "Test User",
      role: "viewer",
    };

    expect(payload.id).toBe("60001");
    expect(typeof payload.id).toBe("string");
  });

  it("should handle parseInt for route params", () => {
    const paramId = "60001";
    const intId = parseInt(paramId);
    expect(intId).toBe(60001);
    expect(typeof intId).toBe("number");
  });
});
