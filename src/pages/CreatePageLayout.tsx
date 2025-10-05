import type { Component } from 'solid-js';
import { CreatePageHeader } from './CreatePageHeader';
import { t } from '../stores/i18n';

interface CreatePageLayoutProps {
  children: any;
}

export const CreatePageLayout: Component<CreatePageLayoutProps> = (props) => {
  return (
    <div class="min-h-screen bg-gray-50">
      <CreatePageHeader />
      <div class="max-w-7xl mx-auto px-3 py-1 h-[calc(100vh-40px)] lg:h-[calc(100vh-48px)]">
        <div class="mb-1">
          <h1 class="text-base font-bold text-gray-900 mb-1">{t('create.title')}</h1>
          <p class="text-xs text-gray-600">Generate custom QR codes for URLs, text, WiFi, and more</p>
        </div>
        {props.children}
      </div>
    </div>
  );
};