import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { upcomingDeadlines } from './deadlines';
import { daysWord, formatDate, parseISO } from './format';
import { DEADLINE_LABEL } from './theme';
import type { Project, Settings } from './types';

// iOS povoľuje najviac 64 naplánovaných lokálnych notifikácií
const IOS_LIMIT = 60;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const res = await Notifications.requestPermissionsAsync();
  return res.granted;
}

/** Zruší všetky naplánované pripomienky a naplánuje ich znova podľa aktuálnych projektov. */
export async function rescheduleAll(projects: Project[], settings: Settings) {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!settings.notificationsEnabled) return;
  const perm = await Notifications.getPermissionsAsync();
  if (!perm.granted) return;

  const now = Date.now();
  const planned: { at: Date; title: string; body: string; projectId: string }[] = [];
  for (const d of upcomingDeadlines(projects)) {
    for (const before of settings.notifyDays) {
      const at = parseISO(d.date);
      at.setDate(at.getDate() - before);
      at.setHours(9, 0, 0, 0);
      if (at.getTime() <= now) continue;
      planned.push({
        at,
        projectId: d.projectId,
        title: `${DEADLINE_LABEL[d.kind]} o ${before} ${daysWord(before)}`,
        body: `${d.projectName} — termín ${formatDate(d.date)}`,
      });
    }
  }
  planned.sort((a, b) => a.at.getTime() - b.at.getTime());

  for (const n of planned.slice(0, IOS_LIMIT)) {
    await Notifications.scheduleNotificationAsync({
      content: { title: n.title, body: n.body, data: { projectId: n.projectId } },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: n.at },
    });
  }
}

export async function sendTestNotification() {
  await Notifications.scheduleNotificationAsync({
    content: { title: 'Grantér', body: 'Notifikácie fungujú. Na žiadny termín nezabudnete.' },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 3 },
  });
}
