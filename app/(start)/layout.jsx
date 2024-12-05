import Header from "@/components/custom/Header";
import React from "react";

const layout = ({ children }) => {
  return (
    <div>
      <Header />
      <section className="min-h-[calc(100vh-72px)] bg-neutral-900 text-white">
        {children}
      </section>
    </div>
  );
};

export default layout;