import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { Card, Chip, ChipRow, DaysBox, Empty, Screen, Title, s } from '@/components/ui';
import { daysUntil, formatDate } from '@/lib/format';
import { demoCalls } from '@/lib/seed';
import { useStore } from '@/lib/store';
import { AREA, C, ORG_TYPE } from '@/lib/theme';
import type { CallArea, OrgType } from '@/lib/types';

export default function Calls() {
  const { settings } = useStore();
  const calls = useMemo(demoCalls, []);
  const [org, setOrg] = useState<OrgType | 'all'>(settings.orgType);
  const [area, setArea] = useState<CallArea | 'all'>('all');
  const [q, setQ] = useState('');

  const list = calls
    .filter((c) => org === 'all' || c.orgTypes.includes(org))
    .filter((c) => area === 'all' || c.area === area)
    .filter((c) => !q || (c.name + c.provider + c.description).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => a.deadline.localeCompare(b.deadline));

  return (
    <Screen>
      <View>
        <Title>Výzvy</Title>
        <Text style={s.small}>Otvorené grantové programy filtrované pre vašu organizáciu.</Text>
      </View>
      <View style={{ backgroundColor: C.orangeSoft, borderRadius: 12, padding: 12, borderLeftWidth: 4, borderLeftColor: C.accent }}>
        <Text style={{ color: C.orange, fontSize: 13, lineHeight: 18 }}>
          Ukážkové dáta — nejde o reálne overené výzvy. V produkčnej verzii sa sem načíta kurátorovaná databáza z napisemprojekt.sk.
        </Text>
      </View>
      <TextInput value={q} onChangeText={setQ} placeholder="Hľadať výzvu…" placeholderTextColor={C.faint} style={s.input} clearButtonMode="while-editing" />
      <ChipRow>
        <Chip label="Všetci" active={org === 'all'} onPress={() => setOrg('all')} />
        {(Object.keys(ORG_TYPE) as OrgType[]).map((o) => (
          <Chip key={o} label={ORG_TYPE[o]} active={org === o} onPress={() => setOrg(o)} />
        ))}
      </ChipRow>
      <ChipRow>
        <Chip label="Všetky oblasti" active={area === 'all'} onPress={() => setArea('all')} />
        {(Object.keys(AREA) as CallArea[]).map((a) => (
          <Chip key={a} label={AREA[a]} active={area === a} onPress={() => setArea(a)} />
        ))}
      </ChipRow>
      {list.length === 0 && <Empty text="Žiadne výzvy pre zvolené filtre." />}
      {list.map((c) => (
        <Card key={c.id} onPress={() => router.push(`/call/${c.id}`)} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <DaysBox days={daysUntil(c.deadline)} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={s.kicker}>{AREA[c.area].toUpperCase()}</Text>
            <Text style={s.projectName}>{c.name}</Text>
            <Text style={s.small}>
              {c.provider} · {c.amountText}
            </Text>
            <Text style={s.small}>Uzávierka {formatDate(c.deadline)}</Text>
          </View>
        </Card>
      ))}
    </Screen>
  );
}
