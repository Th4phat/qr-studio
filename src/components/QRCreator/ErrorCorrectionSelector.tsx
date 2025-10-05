import type { Component } from 'solid-js';
import type { QRConfig } from '../../types';
import { t } from '../../stores/i18n';

interface ErrorCorrectionSelectorProps {
  config: QRConfig;
  onConfigChange: (config: QRConfig) => void;
}

export const ErrorCorrectionSelector: Component<ErrorCorrectionSelectorProps> = (props) => {
  return (
    <div class="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
      <h3 class="text-sm font-semibold text-gray-900 mb-2 flex items-center">
        <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        {t('create.options.error_correction')}
      </h3>
      <div class="grid grid-cols-2 gap-2">
        <button
          onClick={() => props.onConfigChange({ ...props.config, errorCorrection: 'L' as any })}
          class={`p-2 rounded-lg border-2 transition-all text-xs ${
            props.config.errorCorrection === 'L'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-gray-300 text-gray-700'
          }`}
        >
          <div class="font-medium">{t('create.options.low')}</div>
          <div class="opacity-75">7%</div>
        </button>
        <button
          onClick={() => props.onConfigChange({ ...props.config, errorCorrection: 'M' as any })}
          class={`p-2 rounded-lg border-2 transition-all text-xs ${
            props.config.errorCorrection === 'M'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-gray-300 text-gray-700'
          }`}
        >
          <div class="font-medium">{t('create.options.medium')}</div>
          <div class="opacity-75">15%</div>
        </button>
        <button
          onClick={() => props.onConfigChange({ ...props.config, errorCorrection: 'Q' as any })}
          class={`p-2 rounded-lg border-2 transition-all text-xs ${
            props.config.errorCorrection === 'Q'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-gray-300 text-gray-700'
          }`}
        >
          <div class="font-medium">{t('create.options.quartile')}</div>
          <div class="opacity-75">25%</div>
        </button>
        <button
          onClick={() => props.onConfigChange({ ...props.config, errorCorrection: 'H' as any })}
          class={`p-2 rounded-lg border-2 transition-all text-xs ${
            props.config.errorCorrection === 'H'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-gray-300 text-gray-700'
          }`}
        >
          <div class="font-medium">{t('create.options.high')}</div>
          <div class="opacity-75">30%</div>
        </button>
      </div>
    </div>
  );
};