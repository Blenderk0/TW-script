import { router, useLocalSearchParams } from 'expo-router';
import { Linking, Text, View } from 'react-native';

import { Button, Card, DaysBox, Empty, Screen, Title, s } from '@/components/ui';
import { daysUntil, formatDate } from '@/lib/format';
import { demoCalls } from '@/lib/seed';
import { AREA, C, ORG_TYPE } from '@/lib/theme';

export default function CallDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = demoCalls().find((x) => x.id === id);
  if (!c) {
    return (
      <Screen>
        <Empty text="Výzva sa nenašla." />
      </Screen>
    );
  }
  const days = daysUntil(c.deadline);

  return (
    <Screen>
      <View style={{ gap: 4 }}>
        <Text style={s.kicker}>{AREA[c.area].toUpperCase()} · UKÁŽKOVÁ VÝZVA</Text>
        <Title style={{ fontSize: 28 }}>{c.name}</Title>
        <Text style={s.small}>{c.provider}</Text>
      </View>
      <Card style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <DaysBox days={days} />
        <View style={{ flex: 1 }}>
          <Text style={s.kicker}>UZÁVIERKA</Text>
          <Text style={{ fontSize: 16, fontWeight: '600', color: C.ink }}>{formatDate(c.deadline)}</Text>
        </View>
      </Card>
      <Card style={{ gap: 10 }}>
        <Row k="Výška podpory" v={c.amountText} />
        <Row k="Pre koho" v={c.orgTypes.map((o) => ORG_TYPE[o]).join(', ')} />
        <Row k="Oblasť" v={AREA[c.area]} />
      </Card>
      <Text style={{ fontSize: 16, lineHeight: 23, color: C.ink }}>{c.description}</Text>
      <Button
        label="Vytvoriť projekt z výzvy"
        onPress={() =>
          router.push({ pathname: '/project/form', params: { name: '', provider: c.provider, callName: c.name, podanie: c.deadline } })
        }
      />
      <Button label="Objednať pomoc experta" variant="green" onPress={() => Linking.openURL('https://www.napisemprojekt.sk')} />
    </Screen>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <View style={[s.rowBetween, { alignItems: 'flex-start' }]}>
      <Text style={s.small}>{k}</Text>
      <Text style={{ fontSize: 15, color: C.ink, fontWeight: '600', flexShrink: 1, textAlign: 'right' }}>{v}</Text>
    </View>
  );
}
