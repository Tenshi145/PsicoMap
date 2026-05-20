interface ColorPickerProps {
  value: string | undefined
  defaultColor: string
  presets: string[]
  onChange: (color: string | undefined) => void
}

export default function ColorPicker({ value, defaultColor, presets, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <button
        title="Restablecer color"
        onClick={() => onChange(undefined)}
        className={`w-7 h-7 rounded border-2 flex items-center justify-center text-sm font-bold
          ${!value ? 'border-blue-500 text-blue-600' : 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'}
          bg-white dark:bg-gray-800`}
      >
        ×
      </button>
      {presets.map((c) => (
        <button
          key={c}
          title={c}
          onClick={() => onChange(c)}
          className={`w-7 h-7 rounded border-2 ${value === c ? 'border-blue-500' : 'border-gray-200 dark:border-gray-600'}`}
          style={{ backgroundColor: c }}
        />
      ))}
      <input
        type="color"
        value={value ?? defaultColor}
        onChange={(e) => onChange(e.target.value)}
        className="w-7 h-7 rounded border border-gray-300 dark:border-gray-600 cursor-pointer p-0 bg-transparent"
        title="Color personalizado"
      />
    </div>
  )
}
