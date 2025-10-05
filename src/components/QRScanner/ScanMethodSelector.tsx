import type { Component } from 'solid-js';
import { Button } from '../UI/Button';
import { t } from '../../stores/i18n';

interface ScanMethodSelectorProps {
  currentMethod: 'file' | 'camera' | 'clipboard';
  onMethodChange: (method: 'file' | 'camera' | 'clipboard') => void;
}

export const ScanMethodSelector: Component<ScanMethodSelectorProps> = (props) => {
  return (
    <div class="mb-8">
      <div class="flex space-x-2 mb-6">
        <Button
          variant={props.currentMethod === 'file' ? 'primary' : 'outline'}
          onClick={() => props.onMethodChange('file')}
        >
          {t('scan.methods.file')}
        </Button>
        <Button
          variant={props.currentMethod === 'camera' ? 'primary' : 'outline'}
          onClick={() => props.onMethodChange('camera')}
        >
          {t('scan.methods.camera')}
        </Button>
        <Button
          variant={props.currentMethod === 'clipboard' ? 'primary' : 'outline'}
          onClick={() => props.onMethodChange('clipboard')}
        >
          {t('scan.methods.clipboard')}
        </Button>
      </div>
    </div>
  );
};