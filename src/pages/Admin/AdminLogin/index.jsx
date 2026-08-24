import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../../store/adminSlice';
import { ADMIN_AUTH } from '../../../config/adminAuth';
import AdminLoginForm from './components/AdminLoginForm';

function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, clearError } = useAdminAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/admin';

  function validate() {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'Please enter a valid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    clearError();
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;
    try {
      await login({ email: form.email, password: form.password }).unwrap();
      navigate(from, { replace: true });
    } catch {
      /* error surfaced via admin slice */
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50 overflow-hidden px-4 py-10">
      {/* Ambient glows */}
      <div className="absolute -top-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-brand-blue/10 blur-3xl" />
      <div className="absolute -bottom-44 -left-28 h-[26rem] w-[26rem] rounded-full bg-brand-gold/10 blur-3xl" />

      {/* Dim grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <AdminLoginForm
        form={form}
        errors={errors}
        error={error}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        loading={loading}
        updateField={updateField}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default AdminLogin;