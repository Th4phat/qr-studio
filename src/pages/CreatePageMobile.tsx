import type { Component } from 'solid-js';
import type { QRConfig } from '../types';
import { CreatorSimple } from '../components/QRCreator/CreatorSimple';
import { QRPreview } from '../components/QRCreator/QRPreview';

interface CreatePageMobileProps {
  config: QRConfig;
  qrCode?: { svg: string; pngBlob: Blob } | null;
  onConfigChange: (config: QRConfig) => void;
  onDownloadPNG: () => void;
  onDownloadSVG: () => void;
}

export const CreatePageMobile: Component<CreatePageMobileProps> = (props) => {
  return (
    <div class="lg:hidden space-y-3 pb-4">
      <CreatorSimple
        config={props.config}
        onConfigChange={props.onConfigChange}
      />

      <div class="min-h-[200px]">
        <QRPreview
          qrCode={props.qrCode}
          onDownloadPNG={props.onDownloadPNG}
          onDownloadSVG={props.onDownloadSVG}
        />
      </div>

      <div class="space-y-3">
        <div class="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
          <h3 class="text-sm font-semibold text-gray-900 mb-2">Error Correction</h3>
          <div class="grid grid-cols-4 gap-1">
            {['L', 'M', 'Q', 'H'].map((level) => (
              <button
                onClick={() => props.onConfigChange({ ...props.config, errorCorrection: level as any })}
                class={`px-2 py-1 text-xs rounded ${
                  props.config.errorCorrection === level
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
          <h3 class="text-sm font-semibold text-gray-900 mb-2">Size</h3>
          <div class="flex items-center space-x-2">
            <input
              type="range"
              min="100"
              max="500"
              step="10"
              value={props.config.size}
              onInput={(e) => props.onConfigChange({ ...props.config, size: parseInt(e.target.value) })}
              class="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span class="text-xs text-gray-600 w-12 text-right">{props.config.size}px</span>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
          <h3 class="text-sm font-semibold text-gray-900 mb-2">Colors</h3>
          <div class="grid grid-cols-2 gap-2">
            <div class="flex items-center space-x-2">
              <label class="text-xs text-gray-600">FG:</label>
              <input
                type="color"
                value={props.config.colorDark || '#000000'}
                onChange={(e) => props.onConfigChange({ ...props.config, colorDark: e.target.value })}
                class="h-8 w-full border border-gray-300 rounded cursor-pointer"
              />
            </div>
            <div class="flex items-center space-x-2">
              <label class="text-xs text-gray-600">BG:</label>
              <input
                type="color"
                value={props.config.colorLight || '#FFFFFF'}
                onChange={(e) => props.onConfigChange({ ...props.config, colorLight: e.target.value })}
                class="h-8 w-full border border-gray-300 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};