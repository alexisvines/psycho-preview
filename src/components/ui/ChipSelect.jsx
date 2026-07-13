import { useEffect, useState } from 'react';

/**
 * Selector de pastillas (single-select) con soporte opcional para un chip
 * "Otro" que revela un input de texto libre. `value` siempre es un string,
 * igual que un <select>, para poder usarse directo con react-hook-form.
 */
export function ChipSelect({
  options,
  value,
  onChange,
  allowCustom = false,
  otherLabel = 'Otro',
  placeholder = 'Especifica...',
}) {
  const isKnownOption = options.includes(value);
  const [customMode, setCustomMode] = useState(allowCustom && Boolean(value) && !isKnownOption);
  const [customText, setCustomText] = useState(customMode ? value : '');

  // Si `value` cambia desde afuera (p. ej. reset del form al cargar datos
  // iniciales de una nota vieja), sincroniza el modo "Otro".
  useEffect(() => {
    const known = options.includes(value);
    if (allowCustom && value && !known) {
      setCustomMode(true);
      setCustomText(value);
    } else if (known) {
      setCustomMode(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleSelect = (opt) => {
    setCustomMode(false);
    onChange(opt);
  };

  const handleSelectOther = () => {
    setCustomMode(true);
    onChange(customText);
  };

  const handleCustomChange = (e) => {
    setCustomText(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = !customMode && value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => handleSelect(opt)}
              aria-pressed={selected}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
                selected
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              {opt}
            </button>
          );
        })}
        {allowCustom && (
          <button
            type="button"
            onClick={handleSelectOther}
            aria-pressed={customMode}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
              customMode
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            {otherLabel}
          </button>
        )}
      </div>
      {allowCustom && customMode && (
        <input
          type="text"
          value={customText}
          onChange={handleCustomChange}
          placeholder={placeholder}
          className="mt-2 w-full max-w-xs px-3 py-1.5 text-sm border border-stone-200 rounded-lg bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        />
      )}
    </div>
  );
}
