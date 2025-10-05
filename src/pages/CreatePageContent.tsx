import type { Component } from 'solid-js';

interface CreatePageContentProps {
  children: any;
}

export const CreatePageContent: Component<CreatePageContentProps> = (props) => {
  return (
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-3 h-[calc(100vh-40px)] lg:h-[calc(100vh-80px)] overflow-y-auto">
      {props.children}
    </div>
  );
};