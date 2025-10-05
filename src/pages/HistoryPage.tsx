import type { Component } from 'solid-js';
import { createSignal, onMount, Show } from 'solid-js';
import { A } from '@solidjs/router';
import { historyStore } from '../stores/historyStore';
import type { QRHistoryItem } from '../types';
import { Button } from '../components/UI/Button';
import { Modal } from '../components/UI/Modal';
import { MobileNavigation } from '../components/UI/MobileNavigation';
import LanguageSwitcher from '../components/UI/LanguageSwitcher';
import { t } from '../stores/i18n';

export const HistoryPage: Component = () => {
  const [historyItems, setHistoryItems] = createSignal<QRHistoryItem[]>([]);
  const [filteredItems, setFilteredItems] = createSignal<QRHistoryItem[]>([]);
  const [filter, setFilter] = createSignal<'all' | 'created' | 'scanned'>('all');
  const [searchQuery, setSearchQuery] = createSignal('');
  const [showDeleteModal, setShowDeleteModal] = createSignal(false);
  const [itemToDelete, setItemToDelete] = createSignal<string | null>(null);
  const [loading, setLoading] = createSignal(true);

  onMount(async () => {
    await loadHistory();
  });

  const loadHistory = async () => {
    try {
      setLoading(true);
      const items = await historyStore.getItems();
      setHistoryItems(items);
      setFilteredItems(items);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (newFilter: 'all' | 'created' | 'scanned') => {
    setFilter(newFilter);
    await applyFilters();
  };

  const handleSearchChange = async (query: string) => {
    setSearchQuery(query);
    await applyFilters();
  };

  const applyFilters = async () => {
    let items = historyItems();

    if (filter() !== 'all') {
      items = items.filter(item => item.type === filter());
    }

    if (searchQuery().trim()) {
      const query = searchQuery().toLowerCase();
      items = items.filter(item => 
        item.data.toLowerCase().includes(query)
      );
    }

    setFilteredItems(items);
  };

  const handleDeleteItem = async (id: string) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    const id = itemToDelete();
    if (!id) return;

    try {
      await historyStore.deleteItem(id);
      await loadHistory();
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleClearAll = async () => {
    try {
      await historyStore.clearAll();
      await loadHistory();
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const handleExport = async () => {
    try {
      const jsonData = await historyStore.exportHistory();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-history-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export history:', error);
    }
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

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
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
                class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {t('navigation.scan_qr')}
              </A>
              <A
                href="/history"
                class="text-blue-600 border-b-2 border-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {t('navigation.history')}
              </A>
              <LanguageSwitcher variant="compact" />
            </nav>

            <div class="flex items-center space-x-2">
                        <LanguageSwitcher variant="compact" class="md:hidden" />
                        <MobileNavigation currentPage="history" />
                      </div>
          </div>
        </div>
      </header>

      <div class="max-w-4xl mx-auto px-4 py-8">
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">{t('history.title')}</h1>
              <p class="text-gray-600">{t('history_page.description')}</p>
            </div>
          <div class="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={loading() || filteredItems().length === 0}
            >
              {t('history_page.export')}
            </Button>
            <Button
              variant="outline"
              onClick={handleClearAll}
              disabled={loading() || filteredItems().length === 0}
            >
              {t('history_page.clear_all')}
            </Button>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <div class="flex space-x-2">
            <Button
              variant={filter() === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('all')}
            >
              {t('history_page.all')}
            </Button>
            <Button
              variant={filter() === 'created' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('created')}
            >
              {t('history.created')}
            </Button>
            <Button
              variant={filter() === 'scanned' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('scanned')}
            >
              {t('history.scanned')}
            </Button>
          </div>
          <div class="flex-1">
            <input
              type="text"
              placeholder={t('history.search_placeholder')}
              value={searchQuery()}
              onInput={(e) => handleSearchChange(e.target.value)}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <Show when={loading()}>
        <div class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-gray-600">{t('history_page.loading_history')}</p>
        </div>
      </Show>

      <Show when={!loading() && filteredItems().length === 0}>
        <div class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="text-gray-600">{t('history_page.no_items_found')}</p>
        </div>
      </Show>

      <Show when={!loading() && filteredItems().length > 0}>
        <div class="space-y-4">
          {filteredItems().map((item) => (
            <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.type === 'created' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.type === 'created' ? t('history.created') : t('history.scanned')}
                    </span>
                    <span class="text-sm text-gray-500">
                      {formatDate(item.timestamp)}
                    </span>
                  </div>
                  <p class="text-gray-900 break-all mb-2">
                    {truncateText(item.data)}
                  </p>
                  <Show when={item.data.length > 100}>
                    <button
                      onClick={() => copyToClipboard(item.data)}
                      class="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {t('history_page.view_full_content')}
                    </button>
                  </Show>
                </div>
                <div class="flex space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(item.data)}
                  >
                    {t('common.copy')}
                  </Button>
                  <Show when={item.data.startsWith('http')}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openLink(item.data)}
                    >
                      {t('scan.results.open')}
                    </Button>
                  </Show>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    {t('common.clear')}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Show>

      <Modal
        isOpen={showDeleteModal()}
        onClose={() => setShowDeleteModal(false)}
        title={t('history_page.confirm_delete')}
        size="sm"
      >
        <div class="space-y-4">
          <p class="text-gray-700">
            {t('history_page.delete_warning')}
          </p>
          <div class="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              class="flex-1"
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={confirmDelete}
              class="flex-1"
            >
              {t('common.clear')}
            </Button>
          </div>
        </div>
      </Modal>
      </div>
    </div>
  );
};