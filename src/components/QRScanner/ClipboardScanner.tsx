import { createEffect, type Component } from 'solid-js';
import { qrScanner } from '../../services/qrScanner';
import type { QRScanResult } from '../../types';
import { Button } from '../UI/Button';
import { t } from '../../stores/i18n';

interface ClipboardScannerProps {
  isScanning: boolean;
  setIsScanning: (value: boolean) => void;
  setError: (error: string | null) => void;
  onScanComplete: (result: QRScanResult) => void;
  trigger?: number;
}

export const ClipboardScanner: Component<ClipboardScannerProps> = (props) => {
  const handleClipboardScan = async () => {
    props.setIsScanning(true);
    props.setError(null);

    try {
      const clipboardItems = await navigator.clipboard.read();
      
      for (const item of clipboardItems) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            const blob = await item.getType(type);
            const result = await qrScanner.scanFromBlob(blob);
            props.onScanComplete(result);
            return;
          }
        }
      }
      
      props.setError(t('scan.clipboard.no_image_in_clipboard'));
    } catch (err) {
      props.setError(err instanceof Error ? err.message : t('errors.scan_failed'));
    } finally {
      props.setIsScanning(false);
    }
  };
  createEffect(() => {
    if (props.trigger !== undefined && props.trigger > 0) {
      handleClipboardScan();
    }
  });
  return (
    <div class="text-center py-8">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p class="text-gray-600 mb-2">{t('scan.clipboard.paste_image')}</p>
      <p class="text-sm text-gray-500 mb-4">{t('scan.clipboard.paste_instructions')}</p>
      <Button
        onClick={handleClipboardScan}
        disabled={props.isScanning}
        loading={props.isScanning}
        data-clipboard-trigger
      >
        {t('scan.methods.clipboard')}
      </Button>
    </div>
  );
};