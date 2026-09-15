import { whatsappUserApi } from "./user.api";
import { whatsappAdminApi } from "./admin.api";

export * from "./whatsapp.api";
export * from "./user.api";
export * from "./admin.api";

export const whatsappApiCollection = {
  user: whatsappUserApi,
  admin: whatsappAdminApi,
};

export default whatsappApiCollection;
