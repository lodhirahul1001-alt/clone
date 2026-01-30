import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { loginUserApi } from "../features/actions/AuthAction";
import { Lock, User } from "lucide-react";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await dispatch(loginUserApi(data));
      if (res?.success) navigate("/user-dashboard");
      else alert("Invalid credentials");
    } catch (e) {
      console.error(e);
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left welcome */}
          <div className="hidden lg:block glass p-10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-60 pointer-events-none" />
            <h1 className="text-5xl font-semibold tracking-tight">
              Welcome<span className="text-neon">!</span>
            </h1>
            <p className="mt-4 text-[color:var(--muted)] max-w-md">
              Sign in to access your dashboard, releases, analytics and payouts.
            </p>
            <div className="mt-8">
              <Link to="/" className="btn-ghost">
                Learn more
              </Link>
            </div>
          </div>

          {/* Right form */}
          <div className="glass p-8 md:p-10">
            <h2 className="text-2xl font-semibold mb-1">Sign in</h2>
            <p className="text-sm text-[color:var(--muted)] mb-6">
              Use your email and password to continue.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <div className="relative">
                  <User className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 opacity-70" />
                  <input
                    className="input-ui pl-11"
                    placeholder="Email"
                    type="email"
                    {...register("email", { required: "Email is required" })}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <Lock className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 opacity-70" />
                  <input
                    className="input-ui pl-11"
                    placeholder="Password"
                    type="password"
                    {...register("password", { required: "Password is required" })}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
                )}
              </div>

              <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Signing in..." : "Submit"}
              </button>

              <div className="flex items-center justify-between text-sm text-[color:var(--muted)]">
                <Link to="/forgot-password" className="hover:text-[color:var(--text)]">
                  Forgot password?
                </Link>
                <Link to="/signup" className="hover:text-[color:var(--text)]">
                  Create account
                </Link>
              </div>
            </form>

            <div className="mt-6 text-xs text-[color:var(--muted)]">
              By continuing you agree to our Terms & Privacy Policy.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
