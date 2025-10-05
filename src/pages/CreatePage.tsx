import type { Component } from 'solid-js';
import { createSignal, createEffect, onCleanup } from 'solid-js';
import { qrGenerator } from '../services/qrGenerator';
import { historyStore } from '../stores/historyStore';
import type { QRConfig } from '../types';
import { CreatePageLayout } from './CreatePageLayout';
import { CreatePageContent } from './CreatePageContent';
import { CreatePageMobile } from './CreatePageMobile';
import { CreatePageDesktop } from './CreatePageDesktop';

export const CreatePage: Component = () => {
  const [config, setConfig] = createSignal<QRConfig>({
    data: '',
    version: 'auto',
    errorCorrection: 'M',
    size: 300,
    margin: 4,
    colorDark: '#000000',
    colorLight: '#FFFFFF'
  });

  const [qrCode, setQrCode] = createSignal<{ svg: string; pngBlob: Blob } | null>(null);
  const [error, setError] = createSignal<string | null>(null);

  createEffect(() => {
    const currentConfig = config();
    
    if (!currentConfig.data.trim()) {
      setQrCode(null);
      setError(null);
      return;
    }

    setError(null);

    let timeoutId: ReturnType<typeof setTimeout>;
    
    (async () => {
      try {
        const result = await qrGenerator.generate(currentConfig);
        setQrCode(result);
        
        timeoutId = setTimeout(async () => {
          await historyStore.addItem({
            type: 'created',
            data: currentConfig.data,
            config: currentConfig
          });
        }, 2000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate QR code');
      }
    })();
    
    onCleanup(() => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    });
  });

  const handleDownloadPNG = () => {
    const currentQrCode = qrCode();
    if (!currentQrCode) return;

    const url = URL.createObjectURL(currentQrCode.pngBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-code-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadSVG = () => {
    const currentQrCode = qrCode();
    if (!currentQrCode) return;

    const blob = new Blob([currentQrCode.svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-code-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <CreatePageLayout>
      <CreatePageContent>
        <CreatePageMobile
          config={config()}
          qrCode={qrCode()}
          onConfigChange={setConfig}
          onDownloadPNG={handleDownloadPNG}
          onDownloadSVG={handleDownloadSVG}
        />
        
        <CreatePageDesktop
          config={config()}
          qrCode={qrCode()}
          error={error()}
          onConfigChange={setConfig}
          onDownloadPNG={handleDownloadPNG}
          onDownloadSVG={handleDownloadSVG}
        />
      </CreatePageContent>
    </CreatePageLayout>
  );
};