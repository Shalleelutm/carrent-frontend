const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export type OAuthProvider = "google";

export function oauthLogin(provider: OAuthProvider) {
  // backend should handle: /oauth2/authorization/google or your custom endpoint
  window.location.href = `${API_URL}/oauth2/authorization/${provider}`;
}