import { For, createSignal, Show } from 'solid-js';
import { locales, changeLocale, getCurrentLocale, type Locale } from '../../stores/i18n';
import { t } from '../../stores/i18n';

interface LanguageSwitcherProps {
  class?: string;
  variant?: 'dropdown' | 'toggle' | 'compact';
}

export default function LanguageSwitcher(props: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = createSignal(false);
  const currentLocale = getCurrentLocale;

  const handleLanguageChange = (locale: Locale) => {
    changeLocale(locale);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen());
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  if (props.variant === 'compact') {
    return (
      <div class={`relative ${props.class || ''}`}>
        <button
          onClick={toggleDropdown}
          class="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-400 transition-colors"
          aria-label={t('navigation.language')}
        >
          <span class="text-lg">{locales[currentLocale()].flag}</span>
          <span class="text-sm font-medium hidden sm:inline">
            {locales[currentLocale()].name}
          </span>
          <svg
            class={`w-4 h-4 transition-transform ${isOpen() ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <Show when={isOpen()}>
          <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
            <For each={Object.entries(locales)}>
              {([key, value]) => (
                <button
                  onClick={() => handleLanguageChange(key as Locale)}
                  class={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    currentLocale() === key ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                  } first:rounded-t-lg last:rounded-b-lg`}
                >
                  <span class="text-lg">{value.flag}</span>
                  <span class="font-medium">{value.name}</span>
                  <Show when={currentLocale() === key}>
                    <svg class="w-4 h-4 ml-auto text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </Show>
                </button>
              )}
            </For>
          </div>
        </Show>

        <Show when={isOpen()}>
          <div
            class="fixed inset-0 z-40"
            onClick={closeDropdown}
          />
        </Show>
      </div>
    );
  }

  if (props.variant === 'toggle') {
    return (
      <div class={`flex items-center space-x-2 ${props.class || ''}`}>
        <For each={Object.entries(locales)}>
          {([key, value]) => (
            <button
              onClick={() => handleLanguageChange(key as Locale)}
              class={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                currentLocale() === key
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span class="text-sm">{value.flag}</span>
              <span class="text-sm font-medium">{value.name}</span>
            </button>
          )}
        </For>
      </div>
    );
  }

  return (
    <div class={`relative ${props.class || ''}`}>
      <button
        onClick={toggleDropdown}
        class="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
        aria-label={t('navigation.language')}
      >
        <span class="text-lg">{locales[currentLocale()].flag}</span>
        <span class="font-medium text-gray-700 dark:text-gray-300">
          {locales[currentLocale()].name}
        </span>
        <svg
          class={`w-4 h-4 text-gray-500 transition-transform ${isOpen() ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <Show when={isOpen()}>
        <div class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div class="py-2">
            <For each={Object.entries(locales)}>
              {([key, value]) => (
                <button
                  onClick={() => handleLanguageChange(key as Locale)}
                  class={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    currentLocale() === key ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span class="text-xl">{value.flag}</span>
                  <div class="flex-1">
                    <div class="font-medium">{value.name}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{key.toUpperCase()}</div>
                  </div>
                  <Show when={currentLocale() === key}>
                    <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </Show>
                </button>
              )}
            </For>
          </div>
        </div>
      </Show>

      <Show when={isOpen()}>
        <div
          class="fixed inset-0 z-40"
          onClick={closeDropdown}
        />
      </Show>
    </div>
  );
}