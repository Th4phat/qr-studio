import type { Component } from 'solid-js';
import type { QRConfig } from '../../types';
import { ColorPicker } from '../UI/ColorPicker';
import { t } from '../../stores/i18n';

interface ColorsControlsProps {
  config: QRConfig;
  onConfigChange: (config: QRConfig) => void;
}

export const ColorsControls: Component<ColorsControlsProps> = (props) => {
  return (
    <div class="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
      <h3 class="text-sm font-semibold text-gray-900 mb-2 flex items-center">
        <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
        {t('create.options.colors')}
      </h3>
      <div class="space-y-3">
        <ColorPicker
          value={props.config.colorDark || '#000000'}
          onChange={(color) => props.onConfigChange({ ...props.config, colorDark: color })}
          label="Foreground"
        />
        <ColorPicker
          value={props.config.colorLight || '#FFFFFF'}
          onChange={(color) => props.onConfigChange({ ...props.config, colorLight: color })}
          label="Background"
        />
      </div>
    </div>
  );
};