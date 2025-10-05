import type { Component } from 'solid-js';
import { Router, Route } from '@solidjs/router';
import { CreatePage } from './pages/CreatePage';
import { ScanPage } from './pages/ScanPage';
import { HistoryPage } from './pages/HistoryPage';
import { initializeLocale } from './stores/i18n';

const App: Component = () => {
  initializeLocale();

  return (
    <Router>
      <Route path="/" component={CreatePage} />
      <Route path="/create" component={CreatePage} />
      <Route path="/scan" component={ScanPage} />
      <Route path="/history" component={HistoryPage} />
    </Router>
  );
};

export default App;