import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { uid } from './format';
import { rescheduleAll } from './notifications';
import { defaultSettings, demoProjects } from './seed';
import type { BudgetItem, ItemState, Project, ProjectStatus, Settings } from './types';

const KEY = 'granter:v1';

interface Store {
  ready: boolean;
  projects: Project[];
  settings: Settings;
  getProject: (id: string) => Project | undefined;
  saveProject: (p: Omit<Project, 'id' | 'createdAt' | 'items' | 'notes'> & Partial<Project>) => string;
  deleteProject: (id: string) => void;
  setStatus: (id: string, status: ProjectStatus) => void;
  setNotes: (id: string, notes: string) => void;
  addItem: (id: string, name: string, amount: number) => void;
  removeItem: (id: string, itemId: string) => void;
  cycleItem: (id: string, itemId: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  resetDemo: () => void;
  clearAll: () => void;
}

const Ctx = createContext<Store | null>(null);

const NEXT: Record<ItemState, ItemState> = { caka: 'objednane', objednane: 'dorucene', dorucene: 'caka' };

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const scheduleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) {
          const data = JSON.parse(raw);
          setProjects(data.projects ?? []);
          setSettings({ ...defaultSettings, ...data.settings });
        } else {
          setProjects(demoProjects());
        }
      })
      .catch(() => setProjects(demoProjects()))
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(KEY, JSON.stringify({ projects, settings })).catch(() => {});
    if (scheduleTimer.current) clearTimeout(scheduleTimer.current);
    scheduleTimer.current = setTimeout(() => {
      rescheduleAll(projects, settings).catch(() => {});
    }, 800);
  }, [ready, projects, settings]);

  const patch = useCallback((id: string, fn: (p: Project) => Project) => {
    setProjects((ps) => ps.map((p) => (p.id === id ? fn(p) : p)));
  }, []);

  const value = useMemo<Store>(() => {
    const mapItems = (id: string, fn: (items: BudgetItem[]) => BudgetItem[]) =>
      patch(id, (p) => ({ ...p, items: fn(p.items) }));
    return {
      ready,
      projects,
      settings,
      getProject: (id) => projects.find((p) => p.id === id),
      saveProject: (input) => {
        if (input.id && projects.some((p) => p.id === input.id)) {
          patch(input.id, (p) => ({ ...p, ...input, id: p.id }));
          return input.id;
        }
        const id = uid();
        setProjects((ps) => [
          { items: [], notes: '', ...input, id, createdAt: new Date().toISOString() } as Project,
          ...ps,
        ]);
        return id;
      },
      deleteProject: (id) => setProjects((ps) => ps.filter((p) => p.id !== id)),
      setStatus: (id, status) => patch(id, (p) => ({ ...p, status })),
      setNotes: (id, notes) => patch(id, (p) => ({ ...p, notes })),
      addItem: (id, name, amount) => mapItems(id, (items) => [...items, { id: uid(), name, amount, state: 'caka' }]),
      removeItem: (id, itemId) => mapItems(id, (items) => items.filter((i) => i.id !== itemId)),
      cycleItem: (id, itemId) =>
        mapItems(id, (items) => items.map((i) => (i.id === itemId ? { ...i, state: NEXT[i.state] } : i))),
      updateSettings: (p) => setSettings((s) => ({ ...s, ...p })),
      resetDemo: () => setProjects(demoProjects()),
      clearAll: () => setProjects([]),
    };
  }, [ready, projects, settings, patch]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore musí byť vnútri StoreProvider');
  return s;
}
