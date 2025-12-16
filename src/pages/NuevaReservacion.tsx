import React from "react";
import AddReservacionForm from "@/components/forms/AddReservacionForm";

const NuevaReservacion: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <AddReservacionForm />
    </div>
  );
};

export default NuevaReservacion;
