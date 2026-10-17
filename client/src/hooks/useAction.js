import { useState } from "react";

// બટનની ક્રિયા ચલાવે અને સફળતા/ભૂલનો સંદેશ સાચવે. સફળ થાય તો પરિણામ આપે (નહીંતર undefined).
export default function useAction() {
  const [msg, setMsg] = useState("");
  const run = async (fn, ...after) => {
    try {
      const d = await fn();
      setMsg(d?.msg || "થઈ ગયું");
      after.forEach((f) => f?.());
      return d || true;
    } catch (x) {
      setMsg("⚠ " + x.message);
    }
  };
  return [msg, run];
}
