type SizeSelectorProps = {
  sizes: string[];
  value: string;
  onChange: (value: string) => void;
};

const SizeSelector = ({ sizes, value, onChange }: SizeSelectorProps) => {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
      {sizes.map((size) => (
        <button
          key={size}
          type="button"
          onClick={() => onChange(size)}
          className={`rounded-md border px-3 py-2 text-sm font-semibold transition-fast ${
            value === size ? 'border-ink bg-ink text-white' : 'border-border bg-white text-ink hover:border-ink'
          }`}
          aria-pressed={value === size}
        >
          {size}
        </button>
      ))}
    </div>
  );
};

export default SizeSelector;
