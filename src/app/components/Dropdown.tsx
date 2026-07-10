type Option = {
  value: string;
  label: string;
};

type DropdownProps = {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
};

export default function Dropdown({
  label,
  value,
  options,
  onChange,
}: DropdownProps) {
  return (
    <div className="w-full">
      <label className="block mb-2 font-semibold text-gray-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border rounded-xl bg-white text-black"
      >
        <option value="">اختر...</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}