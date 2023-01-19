import type React from "react";
import { useState } from "react";

export const tw_test: React.FC = () => {
  const [cls, setCls] = useState<string>("bg-red-500 rounded");

  return (
    <>
      <button
        onClick={(e) => {
          setCls("rounded-lg bg-red-500 animate-[wgw_3s]");
          setTimeout(() => {
            setCls("rounded-lg bg-red-500");
          }, 3000);
        }}
        type="submit"
        className={cls}
      >
        Delete all
      </button>
    </>
  );
};

export default tw_test;
