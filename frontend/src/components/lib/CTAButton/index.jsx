export default function CTAButton({
  children,
  disabled = false,
  onClick,
  className = "",
}) {
  return (
    <button
      disabled={disabled}
      onClick={() => onClick?.()}
      className={`border-none text-xs px-4 py-1.5 font-semibold light:text-[#ffffff] rounded-lg bg-primary-button hover:bg-secondary hover:text-white h-[36px] -mr-8 whitespace-nowrap shadow-[0_4px_14px_rgba(0,0,0,0.25)] w-fit transition-all duration-200 hover:shadow-[0_6px_16px_rgba(0,0,0,0.3)] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-primary-button disabled:hover:shadow-[0_4px_14px_rgba(0,0,0,0.25)] ${className}`}
    >
      <div className="flex items-center justify-center gap-2.5">{children}</div>
    </button>
  );
}
