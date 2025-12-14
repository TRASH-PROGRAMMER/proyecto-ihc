// ForgotPasswordPage.tsx - Opción B (pedir correo aquí y luego mostrar mensaje)

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast, ToastContainer } from "@/components/Toast";
import { validateEmailDetailed, sanitizeInput } from "@/utils/validaciones/validaciones";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const clean = sanitizeInput(email);
    const validation = validateEmailDetailed(clean);

    if (!validation.isValid) {
      toast.error("Correo inválido", validation.error!);
      return;
    }

    setSubmitted(true);
    toast.success(
      "Solicitud enviada",
      `Si ${clean} está registrado, recibirás instrucciones de recuperación.`
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-card p-6 rounded-lg max-w-md w-full shadow-lg">
        <h2 className="text-2xl font-bold text-green-700 text-center mb-4">
          Recuperar contraseña
        </h2>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full border p-2 rounded mt-1"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800"
            >
              Enviar instrucciones
            </Button>
          </form>
        ) : (
          <div className="text-center text-sm text-muted-foreground">
            Revisa tu correo para continuar con el proceso.
          </div>
        )}

        <div className="mt-4 text-center">
          <a href="/login" className="text-green-700 hover:text-green-900 text-sm">
            Volver al inicio de sesión
          </a>
        </div>

        <ToastContainer messages={toast.messages} onClose={toast.removeToast} />
      </div>
    </div>
  );
}