"use client";

interface NumericKeypadProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export function NumericKeypad({ value, onChange, maxLength = 6 }: NumericKeypadProps) {
  const handleNumberClick = (num: string) => {
    if (value.length < maxLength) {
      onChange(value + num);
    }
  };

  const handleBackspace = () => {
    onChange(value.slice(0, -1));
  };

  const handleClear = () => {
    onChange("");
  };

  const buttons = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["Clear", "0", "⌫"],
  ];

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Password Display */}
      <div className="mb-6">
        <div className="flex items-center justify-center gap-2 min-h-[60px] bg-white dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-3">
          {Array.from({ length: maxLength }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 ${
                i < value.length
                  ? "bg-zinc-900 dark:bg-zinc-50 border-zinc-900 dark:border-zinc-50"
                  : "bg-transparent border-zinc-300 dark:border-zinc-600"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Keypad Grid */}
      <div className="grid grid-cols-3 gap-3">
        {buttons.map((row, rowIndex) =>
          row.map((button) => {
            const isBackspace = button === "⌫";
            const isClear = button === "Clear";
            const isSpecial = isBackspace || isClear;

            return (
              <button
                key={`${rowIndex}-${button}`}
                type="button"
                onClick={() => {
                  if (isBackspace) {
                    handleBackspace();
                  } else if (isClear) {
                    handleClear();
                  } else {
                    handleNumberClick(button);
                  }
                }}
                className={`
                  h-16 rounded-lg font-semibold text-lg
                  transition-all active:scale-95
                  ${
                    isSpecial
                      ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                      : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-700 border-2 border-zinc-300 dark:border-zinc-700"
                  }
                  ${isClear ? "text-sm" : ""}
                `}
              >
                {button}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
