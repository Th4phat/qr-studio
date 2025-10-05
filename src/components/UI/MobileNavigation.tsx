import type { Component } from 'solid-js';
import { createSignal, Show } from 'solid-js';
import { A } from '@solidjs/router';
import { t } from '../../stores/i18n';

interface MobileNavigationProps {
  currentPage: 'create' | 'scan' | 'history';
}

export const MobileNavigation: Component<MobileNavigationProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen());
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div class="md:hidden">
      <button
        onClick={toggleMenu}
        class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        aria-expanded="false"
      >
        <span class="sr-only">{t('navigation.create_qr')}</span>
        <Show when={!isOpen()}>
          <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Show>
        <Show when={isOpen()}>
          <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Show>
      </button>

      <Show when={isOpen()}>
        <div class="fixed inset-0 z-50 md:hidden">
          <div
            class="absolute inset-0 bg-black bg-opacity-50"
            onClick={closeMenu}
          />
          
          <div class="absolute top-0 right-0 h-full w-full sm:w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div class="flex flex-col h-full">
              <div class="flex items-center justify-between p-4 border-b border-gray-200">
                <div class="flex items-center space-x-2">
                  <div class="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <span class="text-lg font-bold text-gray-900">QR Studio</span>
                </div>
                <button
                  onClick={closeMenu}
                  class="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                >
                  <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav class="flex-1 px-4 py-6 space-y-2">
                <A
                  href="/create"
                  onClick={closeMenu}
                  class={`flex items-center px-3 py-3 rounded-md text-base font-medium transition-colors ${
                    props.currentPage === 'create'
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  {t('navigation.create_qr')}
                </A>
                
                <A
                  href="/scan"
                  onClick={closeMenu}
                  class={`flex items-center px-3 py-3 rounded-md text-base font-medium transition-colors ${
                    props.currentPage === 'scan'
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {t('navigation.scan_qr')}
                </A>
                
                <A
                  href="/history"
                  onClick={closeMenu}
                  class={`flex items-center px-3 py-3 rounded-md text-base font-medium transition-colors ${
                    props.currentPage === 'history'
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('navigation.history')}
                </A>
              </nav>

              <div class="p-4 border-t border-gray-200">
                <div class="text-xs text-gray-500 text-center">
                  QR Studio v1.0.0
                </div>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};