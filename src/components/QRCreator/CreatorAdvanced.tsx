import type { Component } from 'solid-js';
import type { QRConfig } from '../../types';
import { PresetSelector } from './PresetSelector';
import { ErrorCorrectionSelector } from './ErrorCorrectionSelector';
import { DimensionsControls } from './DimensionsControls';
import { ColorsControls } from './ColorsControls';
import { LogoControls } from './LogoControls';
import { t } from '../../stores/i18n';

interface CreatorAdvancedProps {
  config: QRConfig;
  onConfigChange: (config: QRConfig) => void;
}

export const CreatorAdvanced: Component<CreatorAdvancedProps> = (props) => {
  return (
    <div class="space-y-2 overflow-y-auto">
      <PresetSelector 
        config={props.config} 
        onConfigChange={props.onConfigChange} 
      />

      <div class="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <h3 class="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          {t('scan.results.data')}
        </h3>
        <textarea
          value={props.config.data}
          onChange={(e) => props.onConfigChange({ ...props.config, data: e.target.value })}
          placeholder={t('create.text_input_placeholder')}
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all text-sm"
          rows={3}
        />
        <div class="mt-1 text-xs text-gray-500">
          {props.config.data.length} {t('info.chars')}
        </div>
      </div>

      <ErrorCorrectionSelector 
        config={props.config} 
        onConfigChange={props.onConfigChange} 
      />

      <DimensionsControls 
        config={props.config} 
        onConfigChange={props.onConfigChange} 
      />

      <ColorsControls
        config={props.config}
        onConfigChange={props.onConfigChange}
      />

      <LogoControls
        config={props.config}
        onConfigChange={props.onConfigChange}
      />
    </div>
  );
};