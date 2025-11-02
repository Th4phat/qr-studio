import type { Component } from 'solid-js';
import type { QRConfig } from '../../types';
import { t } from '../../stores/i18n';

interface LogoControlsProps {
  config: QRConfig;
  onConfigChange: (config: QRConfig) => void;
}

export const LogoControls: Component<LogoControlsProps> = (props) => {
  const handleLogoUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert(t('create.logo.invalid_format'));
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(t('create.logo.too_large'));
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      props.onConfigChange({
        ...props.config,
        logo: {
          ...props.config.logo,
          src: result
        }
      });
    };
    reader.readAsDataURL(file);
  };
  
  const handleLogoSizeChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const size = parseInt(target.value);
    
    props.onConfigChange({
      ...props.config,
      logo: {
        ...props.config.logo,
        size: size
      }
    });
  };
  
  const handleRemoveLogo = () => {
    props.onConfigChange({
      ...props.config,
      logo: undefined
    });
  };
  
  return (
    <div class="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <h3 class="text-sm font-semibold text-gray-900 mb-3 flex items-center">
        <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {t('create.logo.title')}
      </h3>
      
      {!props.config.logo?.src ? (
        <div>
          <label class="block">
            <div class="flex items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <div class="text-center">
                <svg class="mx-auto h-8 w-8 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="text-xs text-gray-600">{t('create.logo.upload')}</p>
                <p class="text-xs text-gray-400">PNG, JPG, WEBP, ICO, SVG</p>
              </div>
            </div>
            <input
              type="file"
              class="hidden"
              accept="image/*"
              onChange={handleLogoUpload}
            />
          </label>
        </div>
      ) : (
        <div class="space-y-3">
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={props.config.logo.src}
                alt="Logo"
                class="w-full h-full object-contain"
              />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">{t('create.logo.added')}</p>
              <p class="text-xs text-gray-500">{t('create.logo.size')}: {props.config.logo.size || 40}px</p>
            </div>
            <button
              type="button"
              onClick={handleRemoveLogo}
              class="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              {t('create.logo.remove')}
            </button>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {t('create.logo.size_label')}
            </label>
            <div class="flex items-center space-x-2">
              <input
                type="range"
                min="20"
                max="80"
                value={props.config.logo.size || 40}
                onChange={handleLogoSizeChange}
                class="flex-1"
              />
              <span class="text-sm text-gray-600 w-12 text-right">{props.config.logo.size || 40}px</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">{t('create.logo.size_hint')}</p>
          </div>
        </div>
      )}
    </div>
  );
};