export function oauthLogin(provider: "google" | "facebook") {
  window.location.href = `http://localhost:4000/api/auth/${provider}`;
}