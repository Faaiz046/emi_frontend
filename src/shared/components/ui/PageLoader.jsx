import clsx from "clsx";

const CustomLoader = ({ className }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("w-full h-full", className)}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="loader-circle"
      />
      {/* Add CSS globally or via Tailwind config */}
      <style>{`
        @keyframes rotate {
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes dash {
          0% {
            stroke-dasharray: 1, 200;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 89, 200;
            stroke-dashoffset: -35px;
          }
          100% {
            stroke-dasharray: 89, 200;
            stroke-dashoffset: -124px;
          }
        }
        .loader-circle {
          stroke-dasharray: 80, 200;
          stroke-dashoffset: 0;
          transform-origin: center;
          animation: rotate 2s linear infinite, dash 1.5s ease-in-out infinite;
        }
      `}</style>
    </svg>
  );
};

const PageLoader = ({
  variant = "api",
  message = "Loading...",
  size,
  color = "text-blue-500",
  height = "h-screen",
}) => {
  const iconClass = clsx(
    color,
    variant === "lazy" ? "h-14 w-14" : "h-14 w-14",
    size
  );

  if (variant === "lazy") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-white backdrop-blur-md">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full border-4 border-blue-300/30 animate-[spin_6s_linear_infinite]" />
            <div className="absolute inset-1 rounded-full border-4 border-blue-400/40 animate-[spin_8s_linear_infinite_reverse]" />
            <div className="absolute inset-2 rounded-full border-4 border-blue-500/30 animate-[spin_10s_linear_infinite]" />
            <CustomLoader className={iconClass} />
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
        <div className="absolute inset-0 rounded-full border-4 border-blue-300/30 animate-[spin_6s_linear_infinite]" />
        <div className="absolute inset-1 rounded-full border-4 border-blue-400/40 animate-[spin_8s_linear_infinite_reverse]" />
        <div className="absolute inset-2 rounded-full border-4 border-blue-500/30 animate-[spin_10s_linear_infinite]" />
        <CustomLoader className={iconClass} />
      </div>
    </div>
  );
};

export default PageLoader;
