import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setToken } from "../lib/storage";

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setToken(token);

    // small delay to allow storage
    setTimeout(() => {
      navigate("/my-bookings");
    }, 100);
  }, [params, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
      Completing login...
    </div>
  );
}