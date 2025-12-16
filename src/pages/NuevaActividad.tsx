import React from "react";
import AddActividadForm from "@/components/forms/AddActividadForm";

const NuevaActividad: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <AddActividadForm />
    </div>
  );
};

export default NuevaActividad;
