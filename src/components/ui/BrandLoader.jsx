import logo from "../../assets/logo.png";

function BrandLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md">
      <div className="flex flex-col items-center gap-5 animate-fade-in">
        {/* Gradient logo spinner */}
        <div className="relative flex justify-center">
          <img src={logo} alt="Vishwam Logo" className="h-14 w-auto object-contain filter brightness-0 invert animate-pulse-soft" />
          <div
            className="absolute -inset-2 rounded-2xl border-2 border-brand-blue/20 animate-spin-slow"
            style={{ borderTopColor: "rgba(72, 150, 230, 0.6)" }}
          />
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <p className="text-sm font-semibold text-white">Loading OneVishwam</p>
          <div className="flex gap-1">
            <div
              className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrandLoader;
