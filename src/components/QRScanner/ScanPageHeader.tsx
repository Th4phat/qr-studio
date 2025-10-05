import type { Component } from 'solid-js';
import { A } from '@solidjs/router';
import { MobileNavigation } from '../UI/MobileNavigation';
import LanguageSwitcher from '../UI/LanguageSwitcher';
import { t } from '../../stores/i18n';

export const ScanPageHeader: Component = () => {
  return (
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          {/* Logo */}
          <div class="flex items-center">
            <A href="/" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <span class="text-xl font-bold text-gray-900">QR Studio</span>
            </A>
          </div>

          <nav class="hidden md:flex items-center space-x-8">
            <A
              href="/create"
              class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              {t('navigation.create_qr')}
            </A>
            <A
              href="/scan"
              class="text-blue-600 border-b-2 border-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              {t('navigation.scan_qr')}
            </A>
            <A
              href="/history"
              class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              {t('navigation.history')}
            </A>
            <LanguageSwitcher variant="compact" />
          </nav>

          <div class="flex items-center space-x-2">
            <LanguageSwitcher variant="compact" class="md:hidden" />
            <MobileNavigation currentPage="scan" />
          </div>
        </div>
      </div>
    </header>
  );
};