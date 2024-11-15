const GlassToggle = ({
  label1 = "",
  label2 = "",
  checked = false,
  onChange,
  disabled = false,
  className = "",
}: any) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label
        className={`text-white cursor-pointer ${disabled && "opacity-50"}`}
      >
        {label1}
      </label>
      <label className="switch">
        <input type="checkbox" onChange={onChange} />
        <span className="slider round"></span>
      </label>
      <label
        className={`text-white cursor-pointer ${disabled && "opacity-50"}`}
      >
        {label2}
      </label>
    </div>
  );
};

export default GlassToggle;
