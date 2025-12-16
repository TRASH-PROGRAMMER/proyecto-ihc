import React from "react";
import AddGuiaForm from "@/components/forms/AddGuiaForm";

const NuevoGuia: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <AddGuiaForm />
    </div>
  );
};

export default NuevoGuia;
