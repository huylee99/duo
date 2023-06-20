import { ROLE } from "~/server/db/schema";

function authorizedRoles(roles: ROLE[]) {
  return roles;
}

export { authorizedRoles };
