import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button, Chip, ChipRow, Empty, ProjectCard, Screen, Title, s } from '@/components/ui';
import { projectsWord } from '@/lib/format';
import { useStore } from '@/lib/store';
import { STATUS, STATUS_ORDER } from '@/lib/theme';
import type { ProjectStatus } from '@/lib/types';

export default function Projects() {
  const { projects } = useStore();
  const [filter, setFilter] = useState<ProjectStatus | 'all'>('all');
  const list = filter === 'all' ? projects : projects.filter((p) => p.status === filter);

  return (
    <Screen>
      <View>
        <Title>Moje projekty</Title>
        <Text style={s.small}>
          {projects.length} {projectsWord(projects.length)} celkom
        </Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button label="+ Nový projekt" style={{ flex: 1 }} onPress={() => router.push('/project/form')} />
        <Button label="Zhrnutie" variant="secondary" onPress={() => router.push('/summary')} />
      </View>
      <ChipRow>
        <Chip label="Všetky" active={filter === 'all'} onPress={() => setFilter('all')} />
        {STATUS_ORDER.map((st) => (
          <Chip
            key={st}
            label={STATUS[st].label}
            count={projects.filter((p) => p.status === st).length}
            active={filter === st}
            onPress={() => setFilter(st)}
          />
        ))}
      </ChipRow>
      {list.length ? list.map((p) => <ProjectCard key={p.id} p={p} />) : <Empty text="V tejto kategórii nie sú žiadne projekty." />}
    </Screen>
  );
}
