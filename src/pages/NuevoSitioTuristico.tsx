import React from "react";
import AddSitioTuristicoForm from "@/components/forms/AddSitioTuristicoForm";

const NuevoSitioTuristico: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <AddSitioTuristicoForm />
    </div>
  );
};

export default NuevoSitioTuristico;
