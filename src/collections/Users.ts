import type { CollectionConfig } from "payload";
import { adminOnly, adminOnlyField, signedIn } from "../access";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: { useAsTitle: "name", defaultColumns: ["name", "email", "role"], group: "Admin" },
  access: {
    read: signedIn,
    create: adminOnly,
    update: signedIn,
    delete: adminOnly,
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      access: { update: adminOnlyField },
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
      admin: { description: "Editors manage content. Admins also manage users." },
    },
  ],
};
