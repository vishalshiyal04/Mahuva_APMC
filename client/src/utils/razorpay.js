// Razorpay ચેકઆઉટની સ્ક્રિપ્ટ એક જ વાર લોડ કરે
export const loadRzp = () =>
  new Promise((ok, no) => {
    if (window.Razorpay) return ok();
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = ok;
    s.onerror = () => no(new Error("Razorpay લોડ ન થયું, ઇન્ટરનેટ તપાસો"));
    document.body.appendChild(s);
  });
