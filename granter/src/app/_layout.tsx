import * as Notifications from 'expo-notifications';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { StoreProvider } from '@/lib/store';
import { C } from '@/lib/theme';

export default function RootLayout() {
  // Ťuknutie na notifikáciu otvorí detail projektu
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((res) => {
      const id = res.notification.request.content.data?.projectId;
      if (typeof id === 'string') router.push(`/project/${id}`);
    });
    return () => sub.remove();
  }, []);

  return (
    <StoreProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerTintColor: C.green,
          headerStyle: { backgroundColor: C.bg },
          headerShadowVisible: false,
          headerTitleStyle: { color: C.ink },
          contentStyle: { backgroundColor: C.bg },
          headerBackButtonDisplayMode: 'minimal',
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="project/[id]" options={{ title: '' }} />
        <Stack.Screen name="project/form" options={{ presentation: 'modal', title: 'Projekt' }} />
        <Stack.Screen name="summary" options={{ presentation: 'modal', title: 'Zhrnutie projektov' }} />
        <Stack.Screen name="call/[id]" options={{ title: 'Výzva' }} />
      </Stack>
    </StoreProvider>
  );
}
