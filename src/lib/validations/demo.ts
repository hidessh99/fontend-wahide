import { z } from "zod";

export const userSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username minimal 3 karakter" })
    .max(20, { message: "Username maksimal 20 karakter" }),
  email: z.string().email({ message: "Format email tidak valid" }),
});

export type UserInput = z.infer<typeof userSchema>;
