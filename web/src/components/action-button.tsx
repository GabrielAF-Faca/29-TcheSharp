export function ActionButton({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      className={`w-full max-w-sm rounded-xl bg-[#6B4F35] py-4 text-lg font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105 active:scale-95 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
