import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  placeholder?: string;
}

export const ColorPicker: Component<ColorPickerProps> = (props) => {
  const [inputValue, setInputValue] = createSignal(props.value);

  const handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    setInputValue(value);
    
    if (isValidColor(value)) {
      props.onChange(value);
    }
  };

  const handleColorChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    setInputValue(value);
    props.onChange(value);
  };

  const isValidColor = (color: string): boolean => {
    const s = new Option().style;
    s.color = color;
    return s.color !== '';
  };

  return (
    <div class="space-y-1">
      {props.label && (
        <label class="block text-xs font-medium text-gray-700">
          {props.label}
        </label>
      )}
      <div class="flex items-center space-x-2">
        <input
          type="color"
          value={props.value}
          onChange={handleColorChange}
          class="h-6 w-6 border border-gray-300 rounded cursor-pointer"
        />
        <input
          type="text"
          value={inputValue()}
          onChange={handleInputChange}
          placeholder={props.placeholder || '#000000'}
          class="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};