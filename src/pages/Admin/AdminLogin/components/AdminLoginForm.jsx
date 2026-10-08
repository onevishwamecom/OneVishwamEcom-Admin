import logo from '../../../../assets/logo.png';
import Input from '../../../../components/ui/Input';

export default function AdminLoginForm({
  form,
  errors,
  error,
  showPassword,
  setShowPassword,
  loading,
  updateField,
  handleSubmit,
}) {
  return (
    <div className="relative w-full max-w-md animate-fade-in-up">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-elevated-lg">
        {/* Accent top bar */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-blue via-brand-gold to-brand-orange" />

        <div className="p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              <img
                src={logo}
                alt="OneVishwam"
                className="h-11 w-auto object-contain"
              />
            </div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-xs font-bold mb-4">
              <i className="fa-solid fa-shield-halved" aria-hidden="true" />
              Secure Admin Access
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              OneVishwam Core Admin
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Sign in to the admin panel
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl bg-brand-orange/10 border border-brand-orange/25 p-3.5 text-xs text-brand-orange flex items-start gap-2.5 animate-fade-in">
              <i className="fa-solid fa-circle-exclamation mt-0.5" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="admin-email"
              label="Administrator email"
              type="email"
              icon="fa-envelope"
              placeholder="[EMAIL_ADDRESS]"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              error={errors.email}
              required
            />

            <Input
              id="admin-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              icon="fa-lock"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              error={errors.password}
              required
            >
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </Input>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-brand-blue to-brand-blue/80 py-3.5 text-sm font-bold text-white shadow-glow-blue hover:shadow-glow-blue transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fa-solid fa-circle-notch fa-spin" aria-hidden="true" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <i className="fa-solid fa-lock-open text-xs" aria-hidden="true" />
                  Sign In to Admin Panel
                </span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} OneVishwam · Core Admin Console · v1.0
        </p>
      </div>
    </div>
  );
}