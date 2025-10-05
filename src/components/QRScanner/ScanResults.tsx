import type { Component } from 'solid-js';
import { Show } from 'solid-js';
import type { QRScanResult } from '../../types';
import { Button } from '../UI/Button';
import { t } from '../../stores/i18n';

interface ScanResultsProps {
  results: QRScanResult[];
  onCopy: (text: string) => void;
  onOpenLink: (url: string) => void;
}

export const ScanResults: Component<ScanResultsProps> = (props) => {
  const validateAndFormatResult = (result: QRScanResult) => {
    const isUrl = result.data.startsWith('http://') || result.data.startsWith('https://');
    const type = isUrl ? 'url' : 'text';
    
    return {
      ...result,
      type,
      displayText: result.data
    };
  };

  return (
    <Show when={props.results.length > 0}>
      <div>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">{t('scan.results.found_codes', { count: props.results.length })}</h2>
        <div class="space-y-4">
          {props.results.map((result: QRScanResult) => {
            const formatted = validateAndFormatResult(result);
            return (
              <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {formatted.type}
                      </span>
                      <span class="text-sm text-gray-500">
                        {new Date(result.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p class="text-gray-900 break-all">{formatted.displayText}</p>
                  </div>
                  <div class="flex space-x-2 ml-4">
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={() => props.onCopy(result.data)}
                     >
                       {t('common.copy')}
                     </Button>
                     <Show when={formatted.type === 'url'}>
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={() => props.onOpenLink(result.data)}
                       >
                         {t('scan.results.open')}
                       </Button>
                     </Show>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Show>
  );
};