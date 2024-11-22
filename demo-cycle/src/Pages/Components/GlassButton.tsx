const GlassButton = ({
  children,
  onClick,
  disabled = false,
  className = "",
  isActive = false,
}: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`group flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-xl
        ${
          isActive ? "bg-white/50" : "bg-white/10"
        } backdrop-blur-md border border-white/20
      ${!disabled && "hover:bg-white/20 hover:border-white/30"}
      transition-all duration-300 ease-out
      shadow-[white]
      ${disabled && "opacity-50 cursor-not-allowed"}
      ${className}`}
  >
    {children}
  </button>
);
export default GlassButton;
