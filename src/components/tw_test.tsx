import type React from "react";
import { useState } from "react";

export const tw_test: React.FC = () => {
  const [cls, setCls] = useState<string>("bg-red-500 rounded");

  return (
    <>
      <button
        onClick={(e) =>
          setCls(
            "rounded-lg transition-all duration-500 [bg-green-500, bg-orange-500]"
          )
        }
        type="submit"
        className={cls}
      >
        Delete all
      </button>
    </>
  );
};

export default tw_test;
