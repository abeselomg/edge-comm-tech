import type { CollectionBeforeValidateHook, CollectionConfig } from "payload";
import { adminOnly, adminOnlyField, selfOrAdmin, signedIn } from "../access";

/*
 * The first user is an admin. `role` defaults to editor, and /admin offers
 * "Create first user" with no session, so a careless first signup would leave a
 * site nobody can administer. The count overrides access: there is no signed-in
 * user at that point.
 */
export const firstUserIsAdmin: CollectionBeforeValidateHook = async ({ data, operation, req }) => {
  if (operation !== "create") return data;
  const { totalDocs } = await req.payload.count({ collection: "users", overrideAccess: true });
  if (totalDocs === 0) return { ...data, role: "admin" };
  return data;
};

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: { useAsTitle: "name", defaultColumns: ["name", "email", "role"], group: "Admin" },
  access: {
    read: signedIn,
    create: adminOnly,
    update: selfOrAdmin,
    delete: adminOnly,
  },
  hooks: { beforeValidate: [firstUserIsAdmin] },
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
