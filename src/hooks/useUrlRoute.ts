/**
 * useUrlRoute — zero-dependency URL routing hook using the browser History API.
 *
 * Maps clean path segments to tab IDs:
 *   /                     → triage  (default)
 *   /triage               → triage
 *   /beds                 → beds
 *   /routing              → routing
 *   /hbnc                 → hbnc
 *   /audit                → audit
 *   /advisory             → advisory
 *   /tutorial             → triage  (+ isTutorialOpen=true)
 */
import { useState, useEffect, useCallback } from 'react';

export type TabId = 'triage' | 'beds' | 'routing' | 'hbnc' | 'audit' | 'advisory';

const PATH_TO_TAB: Record<string, TabId> = {
  '/':          'triage',
  '/triage':    'triage',
  '/beds':      'beds',
  '/routing':   'routing',
  '/hbnc':      'hbnc',
  '/audit':     'audit',
  '/advisory':  'advisory',
  '/tutorial':  'triage',
};

const TAB_TO_PATH: Record<TabId, string> = {
  triage:   '/triage',
  beds:     '/beds',
  routing:  '/routing',
  hbnc:     '/hbnc',
  audit:    '/audit',
  advisory: '/advisory',
};

function parsePath(pathname: string): { tab: TabId; openTutorial: boolean } {
  const clean = pathname.replace(/\/+$/, '') || '/'; // strip trailing slash
  const tab = PATH_TO_TAB[clean] ?? 'triage';
  const openTutorial = clean === '/tutorial';
  return { tab, openTutorial };
}

export function useUrlRoute() {
  const [activeTab, setActiveTabState] = useState<TabId>(() => parsePath(window.location.pathname).tab);
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(() => parsePath(window.location.pathname).openTutorial);

  /* Sync state when browser back/forward is used */
  useEffect(() => {
    const onPop = () => {
      const { tab, openTutorial } = parsePath(window.location.pathname);
      setActiveTabState(tab);
      setIsTutorialOpen(openTutorial);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  /* Navigate to a tab — pushes to history so back-button works */
  const setActiveTab = useCallback((tab: TabId) => {
    const path = TAB_TO_PATH[tab];
    if (window.location.pathname !== path) {
      window.history.pushState({ tab }, '', path);
    }
    setActiveTabState(tab);
  }, []);

  /* Navigate to /tutorial URL — shareable direct link */
  const openTutorial = useCallback(() => {
    if (window.location.pathname !== '/tutorial') {
      window.history.pushState({ tutorial: true }, '', '/tutorial');
    }
    setIsTutorialOpen(true);
  }, []);

  /* When tutorial closes, restore the tab's URL */
  const closeTutorial = useCallback(() => {
    setIsTutorialOpen(false);
    const path = TAB_TO_PATH[activeTab];
    if (window.location.pathname === '/tutorial') {
      window.history.pushState({ tab: activeTab }, '', path);
    }
  }, [activeTab]);

  return { activeTab, setActiveTab, isTutorialOpen, openTutorial, closeTutorial };
}
