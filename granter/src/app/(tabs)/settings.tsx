import { Alert, Linking, Platform, Switch, Text, View } from 'react-native';

import { Button, Card, Chip, ChipRow, Field, Screen, Section, Title, s } from '@/components/ui';
import { requestPermission, sendTestNotification } from '@/lib/notifications';
import { useStore } from '@/lib/store';
import { C, ORG_TYPE } from '@/lib/theme';
import type { OrgType } from '@/lib/types';

const DAY_OPTIONS = [3, 7, 14, 30];

export default function SettingsScreen() {
  const { settings, updateSettings, resetDemo, clearAll } = useStore();

  const toggleNotifications = async (on: boolean) => {
    if (on) {
      const ok = await requestPermission();
      if (!ok) {
        Alert.alert('Notifikácie sú vypnuté', 'Povoľte notifikácie pre Grantér v Nastaveniach iPhonu.', [
          { text: 'Zrušiť', style: 'cancel' },
          { text: 'Otvoriť Nastavenia', onPress: () => Linking.openSettings() },
        ]);
        return;
      }
    }
    updateSettings({ notificationsEnabled: on });
  };

  const toggleDay = (d: number) => {
    const set = new Set(settings.notifyDays);
    if (set.has(d)) set.delete(d);
    else set.add(d);
    updateSettings({ notifyDays: [...set].sort((a, b) => a - b) });
  };

  return (
    <Screen>
      <Title>Nastavenia</Title>

      <Section title="Organizácia">
        <Field label="Názov organizácie" value={settings.orgName} onChangeText={(orgName) => updateSettings({ orgName })} />
        <Field label="E-mail" value={settings.email} onChangeText={(email) => updateSettings({ email })} keyboardType="email-address" autoCapitalize="none" placeholder="info@organizacia.sk" />
        <Text style={s.label}>Typ organizácie</Text>
        <ChipRow>
          {(Object.keys(ORG_TYPE) as OrgType[]).map((o) => (
            <Chip key={o} label={ORG_TYPE[o]} active={settings.orgType === o} onPress={() => updateSettings({ orgType: o })} />
          ))}
        </ChipRow>
      </Section>

      <Section title="Notifikácie">
        <Card style={{ gap: 12 }}>
          <View style={[s.rowBetween, { alignItems: 'center' }]}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: C.ink }}>Pripomienky termínov</Text>
              <Text style={s.small}>Upozornenie o 9:00 pred každým termínom</Text>
            </View>
            <Switch value={settings.notificationsEnabled} onValueChange={toggleNotifications} trackColor={{ true: C.green }} disabled={Platform.OS === 'web'} />
          </View>
          <Text style={s.label}>Koľko dní vopred</Text>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {DAY_OPTIONS.map((d) => (
              <Chip key={d} label={`${d} dní`} active={settings.notifyDays.includes(d)} onPress={() => toggleDay(d)} />
            ))}
          </View>
          {settings.notificationsEnabled && (
            <Button label="Poslať testovaciu notifikáciu" variant="secondary" small onPress={() => sendTestNotification()} />
          )}
        </Card>
      </Section>

      <Section title="Pomoc experta">
        <Card style={{ backgroundColor: C.ink, borderColor: C.ink, gap: 10 }}>
          <Text style={{ color: '#fff', fontSize: 17, fontWeight: '700' }}>Pomoc s grantmi a dotáciami</Text>
          <Text style={{ color: '#E8E2D4', fontSize: 14, lineHeight: 20 }}>
            Potrebujete napísať žiadosť, konzultáciu alebo pomoc s vyúčtovaním? Kontaktujte napisemprojekt.sk.
          </Text>
          <Button label="www.napisemprojekt.sk" style={{ backgroundColor: C.accent, borderColor: C.accent }} onPress={() => Linking.openURL('https://www.napisemprojekt.sk')} />
        </Card>
      </Section>

      <Section title="Dáta">
        <Text style={s.small}>Dáta sú uložené lokálne v tomto zariadení.</Text>
        <Button
          label="Obnoviť ukážkové projekty"
          variant="secondary"
          onPress={() =>
            Alert.alert('Obnoviť ukážkové projekty?', 'Vaše súčasné projekty budú nahradené ukážkovými.', [
              { text: 'Zrušiť', style: 'cancel' },
              { text: 'Obnoviť', style: 'destructive', onPress: resetDemo },
            ])
          }
        />
        <Button
          label="Vymazať všetky projekty"
          variant="danger"
          onPress={() =>
            Alert.alert('Vymazať všetky projekty?', 'Túto akciu nie je možné vrátiť.', [
              { text: 'Zrušiť', style: 'cancel' },
              { text: 'Vymazať', style: 'destructive', onPress: clearAll },
            ])
          }
        />
      </Section>
      <Text style={[s.small, { textAlign: 'center' }]}>Grantér 1.0 · granty pod kontrolou</Text>
    </Screen>
  );
}
