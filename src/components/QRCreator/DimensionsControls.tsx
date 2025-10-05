import type { Component } from 'solid-js';
import type { QRConfig } from '../../types';
import { Slider } from '../UI/Slider';
import { t } from '../../stores/i18n';

interface DimensionsControlsProps {
  config: QRConfig;
  onConfigChange: (config: QRConfig) => void;
}

export const DimensionsControls: Component<DimensionsControlsProps> = (props) => {
  return (
    <div class="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
      <h3 class="text-sm font-semibold text-gray-900 mb-2 flex items-center">
        <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
        {t('create.options.dimensions')}
      </h3>
      <div class="space-y-3">
        <Slider
          value={props.config.size || 300}
          onChange={(value) => props.onConfigChange({ ...props.config, size: value })}
          min={100}
          max={1000}
          step={10}
          label="Size"
          showValue={true}
          unit="px"
        />
        <Slider
          value={props.config.margin || 4}
          onChange={(value) => props.onConfigChange({ ...props.config, margin: value })}
          min={0}
          max={20}
          step={1}
          label="Margin"
          showValue={true}
        />
      </div>
    </div>
  );
};