import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Button, DeadlineRow, Empty, ProjectCard, Screen, Section, Stat, Title, s } from '@/components/ui';
import { isActive, upcomingDeadlines } from '@/lib/deadlines';
import { eur, formatToday, greeting } from '@/lib/format';
import { useStore } from '@/lib/store';
import { C, serif } from '@/lib/theme';

export default function Overview() {
  const { projects, settings } = useStore();
  const active = projects.filter(isActive);
  const total = projects.filter((p) => p.status !== 'zamietnuta').reduce((sum, p) => sum + p.amount, 0);
  const deadlines = upcomingDeadlines(projects);
  const soon = deadlines.filter((d) => d.days <= 14);

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontFamily: serif, fontWeight: '700', fontSize: 20 }}>G</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: serif, fontWeight: '700', fontSize: 17, color: C.ink }}>Grantér</Text>
          <Text style={s.small} numberOfLines={1}>{settings.orgName}</Text>
        </View>
        <Button label="Zhrnutie" variant="secondary" small onPress={() => router.push('/summary')} />
      </View>

      <View>
        <Text style={s.small}>{formatToday()}</Text>
        <Title style={{ fontSize: 36 }}>{greeting()}</Title>
        <Text style={[s.small, { fontStyle: 'italic', fontSize: 15 }]}>Tu je, čo vás dnes čaká.</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Stat label="Aktívne" value={String(active.length)} hint={`z ${projects.length} celkom`} />
        <Stat label="V 14 dňoch" value={String(soon.length)} hint={soon.length ? 'vyžaduje pozornosť' : 'všetko v pokoji'} highlight={soon.length > 0} />
      </View>
      <Stat label="Celková suma" value={eur(total)} hint="vo všetkých projektoch okrem zamietnutých" />

      <Section
        title="Najbližšie termíny"
        right={<Text onPress={() => router.push('/calendar')} style={{ color: C.green, fontWeight: '600' }}>Celý kalendár</Text>}>
        {deadlines.length ? deadlines.slice(0, 4).map((d) => <DeadlineRow key={d.projectId + d.kind} d={d} />) : <Empty text="Žiadne nadchádzajúce termíny." />}
      </Section>

      <Section title="Aktívne projekty">
        {active.length ? active.map((p) => <ProjectCard key={p.id} p={p} />) : <Empty text="Zatiaľ nemáte aktívne projekty." />}
        <Button label="+ Nový projekt" onPress={() => router.push('/project/form')} />
      </Section>
    </Screen>
  );
}
