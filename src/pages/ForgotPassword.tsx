import { Link } from "react-router-dom";

export default function ForgotPassword() {
  return (
    <div className="max-w-md mx-auto glass rounded-3xl p-8">
      <div className="text-2xl font-extrabold">Reset password</div>
      <div className="text-white/60 mt-1">
        Next phase: connect to backend reset flow.
      </div>

      <div className="mt-6 text-white/70">
        We’ll add:
        <div className="mt-3 space-y-2">
          <div className="chip">POST /api/auth/forgot</div>
          <div className="chip">POST /api/auth/reset</div>
        </div>
      </div>

      <div className="mt-6">
        <Link className="btn-ghost" to="/login">
          Back to login
        </Link>
      </div>
    </div>
  );
}