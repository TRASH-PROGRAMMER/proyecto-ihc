import React from "react";
import AddVisitanteForm from "@/components/forms/AddVisitanteForm";

const NuevoVisitante: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <AddVisitanteForm />
    </div>
  );
};

export default NuevoVisitante;
