import type { CollectionBeforeValidateHook, CollectionConfig } from "payload";
import { adminOnly, adminOnlyField, ROLE_DESCRIPTION, ROLE_OPTIONS, selfOrAdmin, usersRead } from "../access";

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
    read: usersRead,
    create: adminOnly,
    update: selfOrAdmin,
    delete: adminOnly,
    // Payload's default lets any signed-in user unlock a locked account,
    // including an admin's. Read only by POST /api/users/unlock.
    unlock: adminOnly,
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
      options: ROLE_OPTIONS,
      admin: { description: ROLE_DESCRIPTION },
    },
  ],
};
