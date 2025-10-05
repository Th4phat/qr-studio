import type { Component } from 'solid-js';
import type { QRConfig } from '../../types';
import { Button } from '../UI/Button';
import { t } from '../../stores/i18n';

interface QuickActionsProps {
  config: QRConfig;
  onConfigChange: (config: QRConfig) => void;
}

export const QuickActions: Component<QuickActionsProps> = (props) => {
  return (
    <div class="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
      <h3 class="text-sm font-semibold text-gray-900 mb-2 flex items-center">
        <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        {t('quick_actions.title')}
      </h3>
      <div class="space-y-2">
        <Button
          variant="outline"
          onClick={() => {
            const text = props.config.data;
            if (text) {
              navigator.clipboard.writeText(text);
            }
          }}
          class="w-full justify-start text-xs h-8"
          disabled={!props.config.data.trim()}
        >
          <svg class="w-3 h-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {t('quick_actions.copy_text')}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            props.onConfigChange({
              data: '',
              version: 'auto',
              errorCorrection: 'M',
              size: 300,
              margin: 4,
              colorDark: '#000000',
              colorLight: '#FFFFFF'
            });
          }}
          class="w-full justify-start text-xs h-8"
        >
          <svg class="w-3 h-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {t('quick_actions.reset_all')}
        </Button>
      </div>
    </div>
  );
};