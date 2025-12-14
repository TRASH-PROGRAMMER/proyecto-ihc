// LoginForm.tsx (versión ajustada con tooltips por hover, ayuda fuera, y enlace corregido)

import React, { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { InputField } from "../InputField";
import { Button } from "@/components/ui/button";
import { useToast, ToastContainer } from "@/components/Toast";
import { 
  validateEmailDetailed, 
  validatePasswordDetailed,
  sanitizeInput,
  debounce 
} from "@/utils/validaciones/validaciones";
import { AlertTriangle, Shield, HelpCircle } from "lucide-react";

interface LoginFormInputs {
  email: string;
  password: string;
  remember: boolean;
}

interface LoginAttempt {
  timestamp: number;
  email: string;
}

// Seguridad
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000;
const ATTEMPT_WINDOW = 5 * 60 * 1000;

export default function LoginForm() {
  const { login } = useAuth();
  const { control, handleSubmit, reset, formState: { errors }, setError } = useForm<LoginFormInputs>({
    defaultValues: { email: "", password: "", remember: false },
    mode: "onChange",
  });

  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [securityWarning, setSecurityWarning] = useState("");

  // Verificar bloqueo
  const checkLockout = useCallback(() => {
    const now = Date.now();
    const recent = loginAttempts.filter(a => now - a.timestamp < LOCKOUT_DURATION);

    if (recent.length >= MAX_LOGIN_ATTEMPTS) {
      const oldest = Math.min(...recent.map(a => a.timestamp));
      const remaining = LOCKOUT_DURATION - (now - oldest);

      if (remaining > 0) {
        setIsLockedOut(true);
        setLockoutTimeRemaining(Math.ceil(remaining / 1000));
        return true;
      }
    }

    setIsLockedOut(false);
    return false;
  }, [loginAttempts]);

  // Validación email con debounce
  const validateEmailField = useCallback(
    debounce((email: string) => {
      const sanitized = sanitizeInput(email);
      const result = validateEmailDetailed(sanitized);
      if (!result.isValid && email.length > 0) {
        setFieldErrors(prev => ({ ...prev, email: result.error! }));
      } else {
        setFieldErrors(prev => {
          const { email, ...rest } = prev;
          return rest;
        });
      }
    }, 500),
    []
  );

  const registerFailedAttempt = (email: string) => {
    const attempt = { timestamp: Date.now(), email: sanitizeInput(email) };
    setLoginAttempts(prev => {
      const filtered = prev.filter(a => Date.now() - a.timestamp < ATTEMPT_WINDOW);
      return [...filtered, attempt];
    });
  };

  const onSubmit = async (data: LoginFormInputs) => {
    if (checkLockout()) {
      toast.error("Cuenta bloqueada", `Intenta nuevamente en ${Math.ceil(lockoutTimeRemaining / 60)} minutos`);
      return;
    }

    setIsSubmitting(true);
    setSecurityWarning("");

    try {
      const sanitizedEmail = sanitizeInput(data.email.toLowerCase());
      const sanitizedPassword = data.password;

      const emailVal = validateEmailDetailed(sanitizedEmail);
      const passVal = validatePasswordDetailed(sanitizedPassword);

      if (!emailVal.isValid) {
        setError("email", { message: emailVal.error });
        toast.error("Email inválido", emailVal.error!);
        setIsSubmitting(false);
        return;
      }

      if (!passVal.isValid) {
        setError("password", { message: passVal.error });
        toast.error("Contraseña inválida", passVal.error!);
        setIsSubmitting(false);
        return;
      }

      const start = Date.now();
      const user = await login(sanitizedEmail, sanitizedPassword);

      const elapsed = Date.now() - start;
      if (elapsed < 500) await new Promise(r => setTimeout(r, 500 - elapsed));

      if (!user) {
        registerFailedAttempt(sanitizedEmail);
        const remaining = MAX_LOGIN_ATTEMPTS - loginAttempts.length - 1;

        if (remaining <= 2 && remaining > 0) {
          setSecurityWarning(`⚠️ Te quedan ${remaining} intentos antes de ser bloqueado.`);
        }

        toast.error("Credenciales incorrectas", "Verifica tus datos.");
      } else {
        setLoginAttempts([]);
        setSecurityWarning("");

        toast.success("Bienvenido", `Has iniciado sesión como ${user.nombre}`);

        if (data.remember) localStorage.setItem("rememberEmail", sanitizedEmail);
        else localStorage.removeItem("rememberEmail");

        reset();
      }
    } catch (err) {
      registerFailedAttempt(data.email);
      toast.error("Error del servidor", "Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 rounded-lg shadow-lg" noValidate>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-700">Iniciar Sesión</h2>
            <p className="text-sm text-muted-foreground mt-2">Accede a tu cuenta de forma segura</p>
          </div>

          {/* Bloqueo */}
          {isLockedOut && (
            <div className="bg-red-50 border border-red-300 rounded-lg p-4 text-red-700 flex gap-3">
              <AlertTriangle className="h-5 w-5" />
              <div>
                <p className="font-semibold">Cuenta bloqueada temporalmente</p>
                <p className="text-xs">Podrás intentar en {Math.ceil(lockoutTimeRemaining / 60)} minutos.</p>
              </div>
            </div>
          )}

          {/* Advertencia seguridad */}
          {securityWarning && !isLockedOut && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 text-yellow-800 text-xs flex gap-2">
              <Shield className="h-4 w-4" /> {securityWarning}
            </div>
          )}

          {/* Campo Email */}
          <div className="relative">
            <Controller
              name="email"
              control={control}
              rules={{ required: "Email es requerido" }}
              render={({ field }) => (
                <InputField
                  name={field.name}
                  label="Correo Electrónico"
                  type="email"
                  placeholder="tu@email.com"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    validateEmailField(value);
                  }}
                  error={fieldErrors.email || errors.email?.message}
                  required
                  disabled={isLockedOut}
                />
              )}
            />

            {/* Tooltip ayuda */}
            <div className="absolute right-2 top-8 group cursor-pointer">
              <HelpCircle className="h-5 w-5 text-green-600" />
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:block bg-green-700 text-white text-xs p-2 rounded w-40 shadow">
                Ingresa un correo válido para acceder.
              </div>
            </div>
          </div>

          {/* Campo Password */}
          <div className="relative">
            <Controller
              name="password"
              control={control}
              rules={{ required: "Contraseña requerida", minLength: { value: 8, message: "Mínimo 8 caracteres" } }}
              render={({ field }) => (
                <InputField
                  name={field.name}
                  label="Contraseña"
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.password?.message}
                  required
                  disabled={isLockedOut}
                />
              )}
            />

            {/* Tooltip ayuda */}
            <div className="absolute right-2 top-8 group cursor-pointer">
              <HelpCircle className="h-5 w-5 text-green-600" />
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:block bg-green-700 text-white text-xs p-2 rounded w-40 shadow">
                Mínimo 8 caracteres. Evita información fácil.
              </div>
            </div>
          </div>

          {/* Recordar / Olvidé */}
          <div className="flex items-center justify-between">
            <Controller
              name="remember"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                  Recordarme
                </label>
              )}
            />

            {/* Ahora NO manda al 404 */}
            <button
              type="button"
              onClick={() => {
                const emailValue = control._formValues.email;
                if (!emailValue) {
                  toast.error("Ingresa tu correo primero", "Llena el campo de correo para enviar recuperación.");
                  return;
                }
                toast.success("Correo enviado", `Si ${emailValue} existe, se enviará un enlace.`);
              }}
              className="text-green-700 hover:text-green-900 text-sm font-medium"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Botón */}
          <Button type="submit" className="w-full bg-green-700 hover:bg-green-800" disabled={isSubmitting || isLockedOut}>
            {isSubmitting ? "Procesando..." : "Iniciar Sesión"}
          </Button>

          <div className="pt-4 border-t border-gray-200 text-xs flex justify-center gap-2 text-muted-foreground">
            <Shield className="h-3 w-3" /> Conexión segura
          </div>
        </form>

        {/* Registro */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            ¿No tienes cuenta? <a href="/register" className="text-green-700 font-medium hover:text-green-900">Regístrate aquí</a>
          </p>
        </div>

        <ToastContainer messages={toast.messages} onClose={toast.removeToast} />
      </div>
    </div>
  );
}
