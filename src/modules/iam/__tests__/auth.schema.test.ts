import { describe, it, expect } from "bun:test";
import {
  isAllowedRegisterEmailDomain,
  registerSchema,
} from "../schemas/auth.schema";

describe("Email Domain Registration Whitelist", () => {
  describe("isAllowedRegisterEmailDomain", () => {
    it("allows standard Gmail and Googlemail addresses", () => {
      expect(isAllowedRegisterEmailDomain("user@gmail.com")).toBe(true);
      expect(isAllowedRegisterEmailDomain("USER@GMAIL.COM")).toBe(true);
      expect(isAllowedRegisterEmailDomain("john.doe+tag@gmail.com")).toBe(true);
      expect(isAllowedRegisterEmailDomain("user@googlemail.com")).toBe(true);
    });

    it("allows Microsoft Outlook, Hotmail, and Live addresses", () => {
      expect(isAllowedRegisterEmailDomain("user@outlook.com")).toBe(true);
      expect(isAllowedRegisterEmailDomain("user@outlook.co.id")).toBe(true);
      expect(isAllowedRegisterEmailDomain("user@outlook.co.uk")).toBe(true);
      expect(isAllowedRegisterEmailDomain("user@hotmail.com")).toBe(true);
      expect(isAllowedRegisterEmailDomain("user@hotmail.co.id")).toBe(true);
      expect(isAllowedRegisterEmailDomain("user@live.com")).toBe(true);
      expect(isAllowedRegisterEmailDomain("user@msn.com")).toBe(true);
    });

    it("strictly rejects disposable and temporary email addresses", () => {
      expect(isAllowedRegisterEmailDomain("user@tempmail.com")).toBe(false);
      expect(isAllowedRegisterEmailDomain("fake@10minutemail.com")).toBe(false);
      expect(isAllowedRegisterEmailDomain("trash@mailinator.com")).toBe(false);
      expect(isAllowedRegisterEmailDomain("anon@guerrillamail.com")).toBe(false);
      expect(isAllowedRegisterEmailDomain("user@yopmail.com")).toBe(false);
      expect(isAllowedRegisterEmailDomain("disposable@trashmail.com")).toBe(false);
      expect(isAllowedRegisterEmailDomain("hacker@outlook.tempmail.org")).toBe(false);
    });

    it("rejects other public email providers and arbitrary domains", () => {
      expect(isAllowedRegisterEmailDomain("user@yahoo.com")).toBe(false);
      expect(isAllowedRegisterEmailDomain("user@icloud.com")).toBe(false);
      expect(isAllowedRegisterEmailDomain("user@proton.me")).toBe(false);
      expect(isAllowedRegisterEmailDomain("owner@perusahaan.com")).toBe(false);
      expect(isAllowedRegisterEmailDomain("ceo@mybusiness.co.id")).toBe(false);
    });

    it("rejects invalid, empty, or malformed email strings", () => {
      expect(isAllowedRegisterEmailDomain("")).toBe(false);
      expect(isAllowedRegisterEmailDomain("not-an-email")).toBe(false);
      expect(isAllowedRegisterEmailDomain("@gmail.com")).toBe(false);
      expect(isAllowedRegisterEmailDomain("user@")).toBe(false);
    });
  });

  describe("registerSchema validation", () => {
    const validBasePayload = {
      name: "Toko Wahide Jaya",
      phone: "081234567890",
      password: "password1234",
      confirmPassword: "password1234",
      agreeTerms: true,
    };

    it("successfully validates when Gmail or Outlook is provided", () => {
      const gmailResult = registerSchema.safeParse({
        ...validBasePayload,
        email: "tokowahide@gmail.com",
      });
      expect(gmailResult.success).toBe(true);

      const outlookResult = registerSchema.safeParse({
        ...validBasePayload,
        email: "owner.wahide@outlook.com",
      });
      expect(outlookResult.success).toBe(true);
    });

    it("fails validation with error message when temp-mail or yahoo is provided", () => {
      const tempResult = registerSchema.safeParse({
        ...validBasePayload,
        email: "spammer@tempmail.com",
      });
      expect(tempResult.success).toBe(false);
      if (!tempResult.success) {
        const emailIssue = tempResult.error.issues.find(
          (issue) => issue.path[0] === "email"
        );
        expect(emailIssue).toBeDefined();
        expect(emailIssue?.message).toContain("Gmail atau Outlook");
      }

      const yahooResult = registerSchema.safeParse({
        ...validBasePayload,
        email: "user@yahoo.com",
      });
      expect(yahooResult.success).toBe(false);
    });
  });
});
