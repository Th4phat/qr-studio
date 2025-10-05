import type { Component, JSX } from 'solid-js';
import { Show } from 'solid-js';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: JSX.Element;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export const Modal: Component<ModalProps> = (props) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <Show when={props.isOpen}>
      <div class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-screen items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={props.onClose}
          />
          
          {/* Modal */}
          <div class={`relative w-full ${sizeClasses[props.size || 'md']} bg-white rounded-lg shadow-xl`}>
            {/* Header */}
            {(props.title || props.showCloseButton) && (
              <div class="flex items-center justify-between p-6 border-b border-gray-200">
                {props.title && (
                  <h2 class="text-lg font-semibold text-gray-900">
                    {props.title}
                  </h2>
                )}
                {props.showCloseButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={props.onClose}
                    class="!p-2"
                  >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                )}
              </div>
            )}
            
            {/* Body */}
            <div class="p-6">
              {props.children}
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
};