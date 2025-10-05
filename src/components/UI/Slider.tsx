import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  unit?: string;
}

export const Slider: Component<SliderProps> = (props) => {
  const [inputValue, setInputValue] = createSignal(props.value.toString());

  const handleSliderChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = parseFloat(target.value);
    setInputValue(value.toString());
    props.onChange(value);
  };

  const handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = parseFloat(target.value);
    
    if (!isNaN(value) && value >= props.min && value <= props.max) {
      setInputValue(value.toString());
      props.onChange(value);
    }
  };

  return (
    <div class="space-y-1">
      {props.label && (
        <div class="flex items-center justify-between">
          <label class="block text-xs font-medium text-gray-700">
            {props.label}
          </label>
          {props.showValue && (
            <span class="text-xs text-gray-600">
              {inputValue()}{props.unit || ''}
            </span>
          )}
        </div>
      )}
      <div class="flex items-center space-x-2">
        <input
          type="range"
          min={props.min}
          max={props.max}
          step={props.step || 1}
          value={props.value}
          onChange={handleSliderChange}
          class="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <input
          type="number"
          min={props.min}
          max={props.max}
          step={props.step || 1}
          value={inputValue()}
          onChange={handleInputChange}
          class="w-16 px-1 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};