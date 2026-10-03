import { Text, View } from 'react-native';

import { DeadlineRow, Empty, Screen, Title, s } from '@/components/ui';
import { upcomingDeadlines } from '@/lib/deadlines';
import { MONTHS_NOM, parseISO } from '@/lib/format';
import { useStore } from '@/lib/store';
import type { Deadline } from '@/lib/types';

export default function Calendar() {
  const { projects } = useStore();
  const deadlines = upcomingDeadlines(projects);

  const groups: { key: string; label: string; items: Deadline[] }[] = [];
  for (const d of deadlines) {
    const date = parseISO(d.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    let g = groups.find((x) => x.key === key);
    if (!g) {
      g = { key, label: `${MONTHS_NOM[date.getMonth()]} ${date.getFullYear()}`, items: [] };
      groups.push(g);
    }
    g.items.push(d);
  }

  return (
    <Screen>
      <View>
        <Title>Kalendár termínov</Title>
        <Text style={s.small}>Všetky nadchádzajúce termíny vašich projektov.</Text>
      </View>
      {groups.length === 0 && <Empty text="Žiadne nadchádzajúce termíny. Pridajte termíny k projektom." />}
      {groups.map((g) => (
        <View key={g.key} style={{ gap: 8 }}>
          <Text style={[s.sectionTitle, { fontSize: 17 }]}>{g.label}</Text>
          {g.items.map((d) => (
            <DeadlineRow key={d.projectId + d.kind} d={d} />
          ))}
        </View>
      ))}
    </Screen>
  );
}
