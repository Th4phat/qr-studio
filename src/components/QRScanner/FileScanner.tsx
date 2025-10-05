import type { Component } from 'solid-js';
import { onMount, onCleanup } from 'solid-js';
import { qrScanner } from '../../services/qrScanner';
import type { QRScanResult } from '../../types';
import { Button } from '../UI/Button';
import { t } from '../../stores/i18n';

interface FileScannerProps {
  isScanning: boolean;
  setIsScanning: (value: boolean) => void;
  setError: (error: string | null) => void;
  onScanComplete: (result: QRScanResult) => void;
}

export const FileScanner: Component<FileScannerProps> = (props) => {
  let fileInputRef: HTMLInputElement | undefined;
  let dropZoneRef: HTMLDivElement | undefined;

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      props.setError(t('errors.file_not_supported'));
      return;
    }

    await scanFile(file);
  };

  const handleFileScan = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (!file) return;
    await scanFile(file);
  };

  const scanFile = async (file: File) => {
    props.setIsScanning(true);
    props.setError(null);

    try {
      const result = await qrScanner.scanFromFile(file);
      props.onScanComplete(result);
    } catch (err) {
      props.setError(err instanceof Error ? err.message : t('errors.scan_failed'));
    } finally {
      props.setIsScanning(false);
    }
  };

  const handlePaste = async (e: ClipboardEvent) => {
    if (document.activeElement !== dropZoneRef) return;
    
    e.preventDefault();
    
    if (e.clipboardData && e.clipboardData.items) {
      for (let i = 0; i < e.clipboardData.items.length; i++) {
        const item = e.clipboardData.items[i];
        
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            await scanFile(file);
            return;
          }
        }
      }
    }
    
    try {
      const clipboardItems = await navigator.clipboard.read();
      
      for (const item of clipboardItems) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            const blob = await item.getType(type);
            const file = new File([blob], "pasted-image", { type: blob.type });
            await scanFile(file);
            return;
          }
        }
      }
      
      props.setError(t('scan.clipboard.no_image_in_clipboard'));
    } catch (err) {
      if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        if (file.type.startsWith('image/')) {
          await scanFile(file);
          return;
        }
      }
      props.setError(t('errors.scan_failed'));
    }
  };

  onMount(() => {
    if (dropZoneRef) {
      dropZoneRef.tabIndex = 0;
      dropZoneRef.addEventListener('paste', handlePaste);
    }
  });

  onCleanup(() => {
    if (dropZoneRef) {
      dropZoneRef.removeEventListener('paste', handlePaste);
    }
  });

  return (
    <div
      ref={dropZoneRef}
      class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      <p class="text-gray-600 mb-2">{t('scan.file.drag_drop')}</p>
      <p class="text-sm text-gray-500 mb-4">{t('scan.file.supported_formats')}</p>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileScan}
        class="hidden"
        data-file-input
      />
      <Button
        onClick={() => fileInputRef?.click()}
        disabled={props.isScanning}
        loading={props.isScanning}
      >
        {t('scan.file.select_file')}
      </Button>
    </div>
  );
};