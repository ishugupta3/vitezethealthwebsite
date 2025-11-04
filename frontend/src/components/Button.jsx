export default function Button({ title, onClick, variant = "primary", loading = false, disabled = false, className = "" }) {
  const baseClasses = "rounded-xl p-3 font-semibold transition border-2";
  const variants = {
    primary: "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl border-green-600",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-300",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {loading ? 'Loading...' : title}
    </button>
  );
}
