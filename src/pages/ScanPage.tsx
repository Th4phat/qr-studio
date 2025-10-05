import type { Component } from 'solid-js';
import { createSignal, Show, onCleanup, onMount } from 'solid-js';
import { historyStore } from '../stores/historyStore';
import type { QRScanResult } from '../types';
import { ScanPageHeader } from '../components/QRScanner/ScanPageHeader';
import { ScanMethodSelector } from '../components/QRScanner/ScanMethodSelector';
import { FileScanner } from '../components/QRScanner/FileScanner';
import { CameraScanner } from '../components/QRScanner/CameraScanner';
import { ClipboardScanner } from '../components/QRScanner/ClipboardScanner';
import { ScanResults } from '../components/QRScanner/ScanResults';
import { t } from '../stores/i18n';

export const ScanPage: Component = () => {
  const [scanResults, setScanResults] = createSignal<QRScanResult[]>([]);
  const [isScanning, setIsScanning] = createSignal(false);
  const [scanMethod, setScanMethod] = createSignal<'file' | 'camera' | 'clipboard'>('file');
  const [error, setError] = createSignal<string | null>(null);
  const [triggerClipboardScan, setTriggerClipboardScan] = createSignal(0);

  const handleScanComplete = async (result: QRScanResult) => {
    setScanResults(prev => [result, ...prev]);
    
    await historyStore.addItem({
      type: 'scanned',
      data: result.data,
      scanResult: result
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const openLink = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank');
    } else {
      window.open(`https://${url}`, '_blank');
    }
  };

  const handleKeyDown = async (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      e.preventDefault();
      setScanMethod('clipboard');
      setTriggerClipboardScan(prev => prev + 1);
    }
  };

  const handlePaste = async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        setScanMethod('clipboard');
        setTriggerClipboardScan(prev => prev + 1);
        return;
      }
    }
  };

  onMount(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('paste', handlePaste);
  });

  onCleanup(() => {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('paste', handlePaste);
  });

  return (
    <div class="min-h-screen bg-gray-50">
      <ScanPageHeader />
      
      <div class="max-w-4xl mx-auto px-4 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{t('scan.title')}</h1>
          <p class="text-gray-600">{t('scan_page.description')}</p>
        </div>

        <ScanMethodSelector 
          currentMethod={scanMethod()} 
          onMethodChange={setScanMethod} 
        />

        <Show when={scanMethod() === 'file'}>
          <FileScanner
            isScanning={isScanning()}
            setIsScanning={setIsScanning}
            setError={setError}
            onScanComplete={handleScanComplete}
          />
        </Show>

        <Show when={scanMethod() === 'camera'}>
          <CameraScanner
            isScanning={isScanning()}
            setIsScanning={setIsScanning}
            setError={setError}
            onScanComplete={handleScanComplete}
          />
        </Show>

        <Show when={scanMethod() === 'clipboard'}>
          <ClipboardScanner
            isScanning={isScanning()}
            setIsScanning={setIsScanning}
            setError={setError}
            onScanComplete={handleScanComplete}
            trigger={triggerClipboardScan()}
          />
        </Show>

        <Show when={error()}>
          <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error()}
          </div>
        </Show>

        <ScanResults
          results={scanResults()}
          onCopy={copyToClipboard}
          onOpenLink={openLink}
        />
      </div>
    </div>
  );
};