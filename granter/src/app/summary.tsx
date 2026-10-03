import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Alert, Platform, Text, View } from 'react-native';

import { Button, Card, Check, Chip, ChipRow, Field, Screen, Section, s } from '@/components/ui';
import { eur, projectsWord } from '@/lib/format';
import { useStore } from '@/lib/store';
import { buildSummaryHtml } from '@/lib/summary';
import { C, STATUS, STATUS_ORDER } from '@/lib/theme';
import type { Project, ProjectStatus } from '@/lib/types';

type Period = 'all' | 'this' | 'last' | 'four';

const year = new Date().getFullYear();
const PERIODS: { key: Period; label: string }[] = [
  { key: 'all', label: 'Všetky projekty' },
  { key: 'this', label: `Rok ${year}` },
  { key: 'last', label: `Rok ${year - 1}` },
  { key: 'four', label: 'Posledné 4 roky' },
];

const projectYear = (p: Project) => Number((p.deadlines.podanie ?? p.createdAt).slice(0, 4));

export default function Summary() {
  const { projects, settings } = useStore();
  const [title, setTitle] = useState('Prehľad projektov a grantov organizácie');
  const [author, setAuthor] = useState('');
  const [statuses, setStatuses] = useState<ProjectStatus[]>(['podana', 'schvalena', 'realizacia', 'vyuctovana']);
  const [period, setPeriod] = useState<Period>('this');
  const [f, setF] = useState({ showAmount: true, showProvider: true, showDeadlines: true, showItems: false, showNotes: false, showStats: true });
  const [busy, setBusy] = useState(false);

  const inPeriod = (p: Project) => {
    const y = projectYear(p);
    if (period === 'this') return y === year;
    if (period === 'last') return y === year - 1;
    if (period === 'four') return y > year - 4;
    return true;
  };
  const periodProjects = projects.filter(inPeriod);
  const selected = periodProjects.filter((p) => statuses.includes(p.status));
  const total = selected.reduce((sum, p) => sum + p.amount, 0);

  const toggleStatus = (st: ProjectStatus) =>
    setStatuses((list) => (list.includes(st) ? list.filter((x) => x !== st) : [...list, st]));
  const toggle = (k: keyof typeof f) => setF((o) => ({ ...o, [k]: !o[k] }));

  const html = () => buildSummaryHtml(selected, { ...f, title, author, orgName: settings.orgName, statuses });

  const exportPdf = async () => {
    setBusy(true);
    try {
      if (Platform.OS === 'web') {
        await Print.printAsync({ html: html() });
        return;
      }
      const { uri } = await Print.printToFileAsync({ html: html() });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle: title });
      } else {
        Alert.alert('PDF uložené', uri);
      }
    } catch (e) {
      Alert.alert('Nepodarilo sa vytvoriť PDF', String(e));
    } finally {
      setBusy(false);
    }
  };

  const print = async () => {
    try {
      await Print.printAsync({ html: html() });
    } catch {
      // používateľ zrušil tlač
    }
  };

  return (
    <Screen>
      <Text style={[s.small, { marginTop: -4 }]}>Pre zastupiteľstvo, výročnú správu, valné zhromaždenie alebo voličov.</Text>
      <Field label="Názov dokumentu" value={title} onChangeText={setTitle} />
      <Field label="Predkladá" value={author} onChangeText={setAuthor} placeholder="Meno predkladajúceho, funkcia" />

      <Section title="Ktoré projekty zahrnúť">
        <Card style={{ paddingVertical: 2 }}>
          {STATUS_ORDER.map((st) => (
            <Check
              key={st}
              label={STATUS[st].long}
              checked={statuses.includes(st)}
              onPress={() => toggleStatus(st)}
              right={<Text style={s.small}>{periodProjects.filter((p) => p.status === st).length}</Text>}
            />
          ))}
        </Card>
      </Section>

      <Section title="Obdobie">
        <ChipRow>
          {PERIODS.map((p) => (
            <Chip key={p.key} label={p.label} active={period === p.key} onPress={() => setPeriod(p.key)} />
          ))}
        </ChipRow>
        <Text style={[s.small, { fontSize: 12 }]}>Podľa dátumu podania projektu.</Text>
      </Section>

      <Section title="Aké údaje uviesť">
        <Card style={{ paddingVertical: 2 }}>
          <Check label="Suma" checked={f.showAmount} onPress={() => toggle('showAmount')} />
          <Check label="Poskytovateľ a názov výzvy" checked={f.showProvider} onPress={() => toggle('showProvider')} />
          <Check label="Termíny (podanie, realizácia, vyúčtovanie)" checked={f.showDeadlines} onPress={() => toggle('showDeadlines')} />
          <Check label="Stav rozpočtových položiek" checked={f.showItems} onPress={() => toggle('showItems')} />
          <Check label="Poznámky" checked={f.showNotes} onPress={() => toggle('showNotes')} />
          <Check label="Súhrnné štatistiky na začiatku" checked={f.showStats} onPress={() => toggle('showStats')} />
        </Card>
      </Section>

      <View style={{ backgroundColor: C.sand, borderRadius: 12, padding: 12 }}>
        <Text style={{ color: C.ink }}>
          Vybraných: <Text style={{ fontWeight: '700' }}>{selected.length} {projectsWord(selected.length)}</Text> · Celková suma:{' '}
          <Text style={{ fontWeight: '700' }}>{eur(total)}</Text>
        </Text>
      </View>

      <Button label={busy ? 'Generujem…' : 'Vytvoriť PDF a zdieľať'} onPress={exportPdf} disabled={busy || selected.length === 0} />
      {Platform.OS !== 'web' && <Button label="Tlačiť" variant="secondary" onPress={print} disabled={selected.length === 0} />}
    </Screen>
  );
}
