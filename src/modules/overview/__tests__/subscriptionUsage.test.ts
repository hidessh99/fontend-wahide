import { describe, it, expect } from "bun:test";
import {
  calculateDaysRemaining,
  calculateUsagePercentage,
  derivePlanUsage,
} from "../utils/subscriptionUsage";

describe("subscriptionUsage Utility", () => {
  describe("calculateDaysRemaining", () => {
    it("handles null and undefined dates gracefully", () => {
      const res = calculateDaysRemaining(null);
      expect(res.daysRemaining).toBe(0);
      expect(res.isExpired).toBe(false);
      expect(res.formattedDate).toBe("-");
    });

    it("correctly identifies future expiration date", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 15);
      const res = calculateDaysRemaining(futureDate.toISOString());
      expect(res.daysRemaining).toBeGreaterThanOrEqual(14);
      expect(res.isExpired).toBe(false);
      expect(res.isExpiringSoon).toBe(false);
    });

    it("correctly flags expiring soon when days <= 3", () => {
      const soonDate = new Date();
      soonDate.setDate(soonDate.getDate() + 2);
      const res = calculateDaysRemaining(soonDate.toISOString());
      expect(res.isExpiringSoon).toBe(true);
      expect(res.isExpired).toBe(false);
    });

    it("flags expired dates properly", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 2);
      const res = calculateDaysRemaining(pastDate.toISOString());
      expect(res.isExpired).toBe(true);
      expect(res.daysRemaining).toBe(0);
    });
  });

  describe("calculateUsagePercentage", () => {
    it("classifies < 75% as healthy", () => {
      const res = calculateUsagePercentage(500, 1000);
      expect(res.percentage).toBe(50);
      expect(res.status).toBe("healthy");
    });

    it("classifies 75% - 89% as warning", () => {
      const res = calculateUsagePercentage(800, 1000);
      expect(res.percentage).toBe(80);
      expect(res.status).toBe("warning");
    });

    it("classifies >= 90% as critical", () => {
      const res = calculateUsagePercentage(950, 1000);
      expect(res.percentage).toBe(95);
      expect(res.status).toBe("critical");
    });
  });

  describe("derivePlanUsage", () => {
    it("derives complete view model with mock subscription data", () => {
      const mockSub = {
        planId: "p-pro",
        planName: "Wahide Pro Omnichannel",
        planPrice: 299000,
        tier: "PRO TIER",
        quotaUsed: 8400,
        quotaTotal: 15000,
        deviceSlotsUsed: 3,
        deviceSlotsMax: 5,
        hasWatermark: false,
        expiresAt: new Date(Date.now() + 86400000 * 20).toISOString(),
        status: "ACTIVE",
        isActive: true,
      };

      const res = derivePlanUsage(mockSub, null, [
        { status: "CONNECTED", channel_type: "WHATSAPP" },
        { status: "CONNECTED", channel_type: "WHATSAPP" },
        { status: "CONNECTED", channel_type: "WHATSAPP" },
      ]);

      expect(res.planName).toBe("Wahide Pro Omnichannel");
      expect(res.tierBadge).toBe("PRO TIER");
      expect(res.isActive).toBe(true);
      expect(res.channels.length).toBe(3);

      const wa = res.channels.find((c) => c.channelType === "WHATSAPP");
      expect(wa).toBeDefined();
      expect(wa?.sendersUsed).toBe(3);
      expect(wa?.sendersMax).toBe(5);
    });
  });
});
