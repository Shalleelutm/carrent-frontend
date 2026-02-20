import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Later backend will set cookie/session then this can verify.
    // For now, just send user home safely.
    navigate("/", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-r from-brand.blue/10 via-white to-brand.red/10">
      <div className="rounded-3xl border border-black/10 bg-white/85 p-8 text-black/70 font-semibold">
        Completing login…
      </div>
    </div>
  );
}