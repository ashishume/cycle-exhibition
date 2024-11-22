import { Loader2 } from "lucide-react";

const LucideLoaderComp = ({
  icon: Icon = Loader2,
  size = 48,
  color = "currentColor",
  className = "",
  speed = 1,
  message = "",
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Icon
        size={size}
        color={color}
        className={`animate-spin ${className}`}
        style={{ animationDuration: `${1 / speed}s` }}
      />
      {message && (
        <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
      )}
    </div>
  );
};

export default LucideLoaderComp;
