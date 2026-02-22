export function getUserRole(): string | null {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) return null;
    const user = JSON.parse(localStorage.getItem("userProfile") || "null");
    if (user && user.role) return user.role;
    return null;
  } catch {
    return null;
  }
}
