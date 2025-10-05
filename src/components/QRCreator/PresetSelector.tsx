import type { Component } from 'solid-js';
import type { QRConfig } from '../../types';
import { Button } from '../UI/Button';
import { t } from '../../stores/i18n';

interface PresetSelectorProps {
  config: QRConfig;
  onConfigChange: (config: QRConfig) => void;
}

export const PresetSelector: Component<PresetSelectorProps> = (props) => {
  const handlePresetSelect = (preset: string) => {
    const presets = {
      url: {
        data: 'https://',
        errorCorrection: 'M' as const,
        version: 'auto' as const
      },
      text: {
        data: '',
        errorCorrection: 'M' as const,
        version: 'auto' as const
      },
      wifi: {
        data: 'WIFI:T:WPA;S:NetworkName;P:Password;;',
        errorCorrection: 'H' as const,
        version: 'auto' as const
      },
      vcard: {
        data: 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nORG:Company\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD',
        errorCorrection: 'M' as const,
        version: 'auto' as const
      }
    };

    if (presets[preset as keyof typeof presets]) {
      props.onConfigChange({ ...props.config, ...presets[preset as keyof typeof presets] });
    }
  };

  return (
    <div class="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <h3 class="text-sm font-semibold text-gray-900 mb-3 flex items-center">
        <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        {t('create.presets.title')}
      </h3>
      <div class="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePresetSelect('url')}
          class="h-10 flex flex-col items-center justify-center space-y-1 hover:border-blue-500 hover:bg-blue-50 transition-colors text-xs"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
          </svg>
          {t('create.presets.url')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePresetSelect('text')}
          class="h-10 flex flex-col items-center justify-center space-y-1 hover:border-blue-500 hover:bg-blue-50 transition-colors text-xs"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {t('create.presets.text')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePresetSelect('wifi')}
          class="h-10 flex flex-col items-center justify-center space-y-1 hover:border-blue-500 hover:bg-blue-50 transition-colors text-xs"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
          {t('create.presets.wifi')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePresetSelect('vcard')}
          class="h-10 flex flex-col items-center justify-center space-y-1 hover:border-blue-500 hover:bg-blue-50 transition-colors text-xs"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
          </svg>
          {t('create.presets.vcard')}
        </Button>
      </div>
    </div>
  );
};