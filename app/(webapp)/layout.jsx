import Header from "@/components/custom/Header";
import { Suspense } from "react";

const layout = ({ children }) => {
  return (
    <div>
      <Header />
      <Suspense>
        <section className="min-h-[calc(100vh-90px)]">{children}</section>
      </Suspense>
    </div>
  );
};

export default layout;
