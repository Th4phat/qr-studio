import type { Component } from 'solid-js';
import type { QRConfig } from '../types';
import { CreatorAdvanced } from '../components/QRCreator/CreatorAdvanced';
import { QRPreview } from '../components/QRCreator/QRPreview';
import { QuickActions } from '../components/QRCreator/QuickActions';
import { QRInfo } from '../components/QRCreator/QRInfo';

interface CreatePageDesktopProps {
  config: QRConfig;
  qrCode?: { svg: string; pngBlob: Blob } | null;
  error?: string | null;
  onConfigChange: (config: QRConfig) => void;
  onDownloadPNG: () => void;
  onDownloadSVG: () => void;
}

export const CreatePageDesktop: Component<CreatePageDesktopProps> = (props) => {
  return (
    <div class="hidden lg:grid lg:grid-cols-12 lg:col-span-12 gap-3 h-[calc(100vh-80px)]">
      <div class="lg:col-span-5 space-y-2 overflow-y-auto">
        <CreatorAdvanced 
          config={props.config} 
          onConfigChange={props.onConfigChange} 
        />
        
        {props.error && (
          <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {props.error}
            </div>
          </div>
        )}
      </div>

      <div class="lg:col-span-4 space-y-2">
        <QRPreview 
          qrCode={props.qrCode}
          onDownloadPNG={props.onDownloadPNG}
          onDownloadSVG={props.onDownloadSVG}
        />
      </div>

      <div class="lg:col-span-3 space-y-2">
        <QuickActions 
          config={props.config} 
          onConfigChange={props.onConfigChange} 
        />
        <QRInfo 
          config={props.config} 
          qrCode={props.qrCode} 
        />
      </div>
    </div>
  );
};