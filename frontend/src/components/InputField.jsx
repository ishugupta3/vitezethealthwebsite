export default function InputField({ label, value, onChange, type = "text", showCountryCode = false }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-base font-medium mb-2">{label}</label>
      <div className="flex">
        {showCountryCode && (
          <span className="inline-flex items-center px-4 py-3 text-base text-gray-900 bg-green-100 border border-r-0 border-green-300 rounded-l-xl font-semibold">
            +91
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => {
            const inputValue = e.target.value;
            // Allow only numbers for mobile number fields
            if (label && (label.toLowerCase().includes('mobile') || label.toLowerCase().includes('otp'))) {
              if (/^\d*$/.test(inputValue)) {
                onChange(inputValue);
              }
            } else {
              onChange(inputValue);
            }
          }}
          className={`w-full border-2 border-green-300 rounded-xl p-3 text-gray-700 focus:ring-2 focus:ring-green-400 focus:border-green-500 shadow-sm transition-all duration-200 ${showCountryCode ? 'rounded-l-none' : ''}`}
          placeholder={`Enter ${label}`}
        />
      </div>
    </div>
  );
}
