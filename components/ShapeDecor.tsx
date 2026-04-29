type ShapeDecorProps = {
  variant?: "auth" | "dashboard" | "detail";
};

export default function ShapeDecor({ variant = "dashboard" }: ShapeDecorProps) {
  if (variant === "auth") {
    return (
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute -top-24 -right-24"
          width="520" height="520" viewBox="0 0 520 520"
          fill="none"
        >
          <circle cx="260" cy="260" r="240" stroke="#9C6B3C" strokeWidth="1" opacity="0.12" />
          <circle cx="260" cy="260" r="190" stroke="#9C6B3C" strokeWidth="0.5" opacity="0.07" />
        </svg>
        <svg
          className="absolute -bottom-32 -left-32"
          width="380" height="380" viewBox="0 0 380 380"
          fill="none"
        >
          <circle cx="190" cy="190" r="170" fill="#6B635A" opacity="0.04" />
        </svg>
        <svg
          className="absolute top-1/2 left-1/4 -translate-y-1/2"
          width="3" height="120" viewBox="0 0 3 120"
        >
          <line x1="1.5" y1="0" x2="1.5" y2="120" stroke="#9C6B3C" strokeWidth="1" opacity="0.15" />
        </svg>
      </div>
    );
  }

  if (variant === "detail") {
    return (
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute -top-16 -right-16"
          width="320" height="320" viewBox="0 0 320 320"
          fill="none"
        >
          <circle cx="160" cy="160" r="150" stroke="#9C6B3C" strokeWidth="0.75" opacity="0.1" />
        </svg>
        <svg
          className="absolute bottom-0 left-0"
          width="200" height="200" viewBox="0 0 200 200"
          fill="none"
        >
          <circle cx="0" cy="200" r="160" stroke="#6B635A" strokeWidth="0.5" opacity="0.08" />
        </svg>
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute -top-12 right-0"
        width="280" height="280" viewBox="0 0 280 280"
        fill="none"
      >
        <circle cx="140" cy="140" r="130" stroke="#9C6B3C" strokeWidth="0.5" opacity="0.09" />
        <circle cx="140" cy="140" r="80" stroke="#9C6B3C" strokeWidth="0.5" opacity="0.05" />
      </svg>
    </div>
  );
}
