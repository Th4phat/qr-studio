import type { Component } from 'solid-js';
import { Show } from 'solid-js';
import type { QRConfig } from '../../types';
import { t } from '../../stores/i18n';

interface QRInfoProps {
  config: QRConfig;
  qrCode?: { svg: string; pngBlob: Blob } | null;
}

export const QRInfo: Component<QRInfoProps> = (props) => {
  return (
    <div class="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
      <h3 class="text-sm font-semibold text-gray-900 mb-2 flex items-center">
        <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {t('info.title')}
      </h3>
      <div class="space-y-2">
        <div class="flex justify-between items-center py-1 border-b border-gray-100">
          <span class="text-xs text-gray-600">{t('info.data_length')}</span>
          <span class="text-xs font-medium">{props.config.data.length} {t('info.chars')}</span>
        </div>
        <div class="flex justify-between items-center py-1 border-b border-gray-100">
          <span class="text-xs text-gray-600">{t('create.options.error_correction')}</span>
          <span class="text-xs font-medium">{props.config.errorCorrection}</span>
        </div>
        <div class="flex justify-between items-center py-1 border-b border-gray-100">
          <span class="text-xs text-gray-600">{t('create.options.size')}</span>
          <span class="text-xs font-medium">{props.config.size}×{props.config.size}px</span>
        </div>
        <div class="flex justify-between items-center py-1">
          <span class="text-xs text-gray-600">{t('create.options.margin')}</span>
          <span class="text-xs font-medium">{props.config.margin}</span>
        </div>
        <Show when={props.qrCode}>
          <div class="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
            <div class="flex items-center">
              <svg class="w-3 h-3 mr-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-xs font-medium text-green-700">{t('info.ready_to_download')}</span>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
};