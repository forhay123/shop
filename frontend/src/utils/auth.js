import jwtDecode from "jwt-decode";

/**
 * Retrieves and decodes the user's token from local storage.
 * @returns {object|null} The decoded user object or null if no valid token exists.
 */
export function get_current_user_token() {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem("token"); // expired cleanup
      return null;
    }
    return decodedToken;
  } catch (error) {
    console.error("Failed to decode token:", error);
    localStorage.removeItem("token");
    return null;
  }
}

/**
 * Checks if a user has access based on their role and a required route role.
 * Default registered users are "user".
 * @param {string} role - The user's role.
 * @param {string} routeRole - The role required for the route.
 * @returns {boolean} True if the user has access, false otherwise.
 */
export function canAccess(role, routeRole) {
  return role === "admin" || role === routeRole;
}
