import { BiLoaderAlt } from "react-icons/bi";
import clsx from "clsx";

const Loader = ({
  variant = "api",
  message = "Loading...",
  size,
  color = "text-blue-500",
  height = "h-screen",
}) => {
  const iconClass = clsx(
    "animate-spin drop-shadow-lg",
    color,
    variant === "lazy" ? "h-14 w-14" : "h-14 w-14",
    size
  );

  if (variant === "lazy") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-white backdrop-blur-md">
        <div className="flex  items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full border-4 border-blue-300/30 animate-[spin_6s_linear_infinite]"></div>
            <div className="absolute inset-1 rounded-full border-4 border-blue-400/40 animate-[spin_8s_linear_infinite_reverse]"></div>
            <div className="absolute inset-2 rounded-full border-4 border-blue-500/30 animate-[spin_10s_linear_infinite]"></div>
            <BiLoaderAlt className={iconClass} />
          </div>

          {message && (
            <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
              {message}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex justify-center items-center ${height} bg-white`}>
      <div className="relative">
        <div className="absolute inset-0 rounded-full border-4 border-blue-300/30 animate-[spin_6s_linear_infinite]"></div>
        <div className="absolute inset-1 rounded-full border-4 border-blue-400/40 animate-[spin_8s_linear_infinite_reverse]"></div>
        <div className="absolute inset-2 rounded-full border-4 border-blue-500/30 animate-[spin_10s_linear_infinite]"></div>
        <BiLoaderAlt className={iconClass} />
      </div>
    </div>
  );
};

export default Loader;
