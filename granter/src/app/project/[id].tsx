import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Badge, Button, Card, Chip, ChipRow, Empty, Screen, Section, Stat, Title, s } from '@/components/ui';
import { daysUntil, eur, formatDate, formatDateShort, parseAmount, relativeDays } from '@/lib/format';
import { useStore } from '@/lib/store';
import { C, DEADLINE_LABEL, DEADLINE_ORDER, ITEM_STATE, STATUS, STATUS_ORDER } from '@/lib/theme';

export default function ProjectDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const store = useStore();
  const p = store.getProject(id);
  const [itemName, setItemName] = useState('');
  const [itemAmount, setItemAmount] = useState('');

  if (!p) {
    return (
      <Screen>
        <Empty text="Projekt neexistuje alebo bol zmazaný." />
      </Screen>
    );
  }

  const done = p.items.filter((i) => i.state === 'dorucene').length;
  const itemsTotal = p.items.reduce((sum, i) => sum + i.amount, 0);
  const deadlines = DEADLINE_ORDER.filter((k) => p.deadlines[k]);

  const addItem = () => {
    if (!itemName.trim()) return;
    store.addItem(p.id, itemName.trim(), parseAmount(itemAmount));
    setItemName('');
    setItemAmount('');
  };

  const confirmDelete = () =>
    Alert.alert('Zmazať projekt?', `„${p.name}" bude natrvalo odstránený.`, [
      { text: 'Zrušiť', style: 'cancel' },
      {
        text: 'Zmazať',
        style: 'destructive',
        onPress: () => {
          router.back();
          store.deleteProject(p.id);
        },
      },
    ]);

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Text onPress={() => router.push({ pathname: '/project/form', params: { id: p.id } })} style={{ color: C.green, fontSize: 17, fontWeight: '600' }}>
              Upraviť
            </Text>
          ),
        }}
      />
      <Screen>
        <View style={{ gap: 6 }}>
          <Badge status={p.status} />
          <Title style={{ fontSize: 28 }}>{p.name}</Title>
          <Text style={s.small}>{[p.provider, p.callName].filter(Boolean).join(' · ')}</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Stat label="Suma" value={eur(p.amount)} />
          <Stat label="Položky" value={`${done}/${p.items.length}`} hint="doručené" />
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Stat label="Podané" value={p.deadlines.podanie ? formatDateShort(p.deadlines.podanie) : '—'} />
          <Stat label="Vyúčtovať do" value={p.deadlines.vyuctovanie ? formatDateShort(p.deadlines.vyuctovanie) : '—'} />
        </View>

        <Section title="Stav projektu">
          <ChipRow>
            {STATUS_ORDER.map((st) => (
              <Chip key={st} label={STATUS[st].label} active={p.status === st} onPress={() => store.setStatus(p.id, st)} />
            ))}
          </ChipRow>
        </Section>

        <Section title="Termíny">
          {deadlines.length ? (
            <Card style={{ paddingVertical: 4 }}>
              {deadlines.map((k, i) => {
                const date = p.deadlines[k]!;
                const days = daysUntil(date);
                const past = days < 0;
                return (
                  <View key={k} style={[st.row, i > 0 && st.divider]}>
                    <View style={[st.dot, { backgroundColor: past ? '#1FA463' : C.border }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, color: past ? C.muted : C.ink }}>{DEADLINE_LABEL[k]}</Text>
                      <Text style={[s.small, { fontSize: 12 }]}>{relativeDays(days)}</Text>
                    </View>
                    <Text style={{ fontSize: 14, color: past ? C.muted : C.ink }}>{formatDate(date)}</Text>
                  </View>
                );
              })}
            </Card>
          ) : (
            <Empty text="Projekt nemá zadané termíny. Pridajte ich cez Upraviť." />
          )}
        </Section>

        <Section title="Rozpočtové položky">
          <Text style={[s.small, { marginTop: -4 }]}>Ťuknutím zmeníte stav: čaká → objednané → doručené. Podržaním položku zmažete.</Text>
          <Card style={{ paddingVertical: 4 }}>
            {p.items.length === 0 && <Text style={[s.small, { paddingVertical: 12 }]}>Zatiaľ žiadne položky.</Text>}
            {p.items.map((it, i) => {
              const state = ITEM_STATE[it.state];
              const delivered = it.state === 'dorucene';
              return (
                <Pressable
                  key={it.id}
                  onPress={() => store.cycleItem(p.id, it.id)}
                  onLongPress={() =>
                    Alert.alert('Zmazať položku?', it.name, [
                      { text: 'Zrušiť', style: 'cancel' },
                      { text: 'Zmazať', style: 'destructive', onPress: () => store.removeItem(p.id, it.id) },
                    ])
                  }
                  style={({ pressed }) => [st.row, i > 0 && st.divider, pressed && { opacity: 0.6 }]}>
                  <View style={[st.dot, { backgroundColor: state.color, width: 12, height: 12, borderRadius: 6 }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, color: delivered ? C.faint : C.ink }}>{it.name}</Text>
                    <Text style={[s.small, { fontSize: 12 }]}>{state.label}</Text>
                  </View>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: delivered ? C.faint : C.ink }}>{eur(it.amount)}</Text>
                </Pressable>
              );
            })}
            {p.items.length > 0 && (
              <View style={[st.row, st.divider]}>
                <Text style={{ flex: 1, fontWeight: '700', color: C.ink }}>Spolu</Text>
                <Text style={{ fontWeight: '700', color: itemsTotal > p.amount ? C.red : C.ink }}>{eur(itemsTotal)}</Text>
              </View>
            )}
          </Card>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TextInput value={itemName} onChangeText={setItemName} placeholder="Nová položka" placeholderTextColor={C.faint} style={[s.input, { flex: 1 }]} returnKeyType="next" />
            <TextInput value={itemAmount} onChangeText={setItemAmount} placeholder="€" placeholderTextColor={C.faint} keyboardType="decimal-pad" style={[s.input, { width: 90 }]} onSubmitEditing={addItem} />
          </View>
          <Button label="Pridať položku" variant="secondary" small onPress={addItem} disabled={!itemName.trim()} />
        </Section>

        <Section title="Poznámky">
          <NotesField initial={p.notes} onSave={(n) => store.setNotes(p.id, n)} />
        </Section>

        <Card style={{ backgroundColor: C.greenSoft, borderColor: '#B5DEC6', gap: 8 }}>
          <Text style={{ fontWeight: '700', fontSize: 16, color: C.green }}>Potrebujete pomoc?</Text>
          <Text style={{ color: C.green, fontSize: 14 }}>Žiadosť, konzultácia alebo vyúčtovanie — objednajte si pomoc experta.</Text>
          <Button label="Objednať pomoc experta" variant="green" small onPress={() => Linking.openURL('https://www.napisemprojekt.sk')} />
        </Card>

        <Button label="Zmazať projekt" variant="danger" onPress={confirmDelete} />
      </Screen>
    </>
  );
}

function NotesField({ initial, onSave }: { initial: string; onSave: (n: string) => void }) {
  const [text, setText] = useState(initial);
  return (
    <TextInput
      value={text}
      onChangeText={setText}
      onEndEditing={() => text !== initial && onSave(text)}
      onBlur={() => text !== initial && onSave(text)}
      placeholder="Kontakty, čísla zmlúv, čo treba dorobiť…"
      placeholderTextColor={C.faint}
      multiline
      style={[s.input, { minHeight: 100, textAlignVertical: 'top' }]}
    />
  );
}

const st = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  divider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.border },
  dot: { width: 9, height: 9, borderRadius: 5 },
});
