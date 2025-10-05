import type { Component } from 'solid-js';
import { Show } from 'solid-js';
import { Button } from '../UI/Button';
import { t } from '../../stores/i18n';

interface QRPreviewProps {
  qrCode?: { svg: string; pngBlob: Blob } | null;
  onDownloadPNG: () => void;
  onDownloadSVG: () => void;
}

export const QRPreview: Component<QRPreviewProps> = (props) => {
  return (
    <div class="bg-white rounded-lg border border-gray-200 p-2 lg:p-3 shadow-sm lg:h-full flex flex-col">
      <h3 class="text-sm font-semibold text-gray-900 mb-1 lg:mb-2 flex items-center">
        <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        {t('create.export.title')}
      </h3>
      
      <div class="flex-1 flex flex-col">
        <Show
          when={props.qrCode}
          fallback={
            <div class="flex-1 flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
              <div class="text-center">
                <svg class="mx-auto h-6 w-6 lg:h-8 lg:w-8 text-gray-400 mb-1 lg:mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                <p class="text-gray-500 text-xs">{t('history.empty')}</p>
                <p class="text-gray-400 text-xs">{t('create.generate')}</p>
              </div>
            </div>
          }
        >
          <div class="flex-1 flex flex-col space-y-2 lg:space-y-3">
            <div
              class="flex-1 flex items-center justify-center bg-white p-2 lg:p-4 rounded-lg shadow-inner"
              innerHTML={props.qrCode!.svg}
            />
            
            <div class="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={props.onDownloadPNG}
                class="flex items-center justify-center space-x-1 text-xs h-7 lg:h-8"
              >
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>{t('create.export.png')}</span>
              </Button>
              <Button
                variant="outline"
                onClick={props.onDownloadSVG}
                class="flex items-center justify-center space-x-1 text-xs h-7 lg:h-8"
              >
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>{t('create.export.svg')}</span>
              </Button>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
};