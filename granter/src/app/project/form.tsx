import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

import { DateField } from '@/components/date-field';
import { Button, Card, Chip, ChipRow, Field, Screen, Section, s } from '@/components/ui';
import { parseAmount } from '@/lib/format';
import { useStore } from '@/lib/store';
import { C, DEADLINE_LABEL, DEADLINE_ORDER, STATUS, STATUS_ORDER } from '@/lib/theme';
import type { DeadlineKind, ISODate, ProjectStatus } from '@/lib/types';

export default function ProjectForm() {
  const params = useLocalSearchParams<{ id?: string; name?: string; provider?: string; callName?: string; podanie?: string }>();
  const { getProject, saveProject } = useStore();
  const existing = params.id ? getProject(params.id) : undefined;

  const [name, setName] = useState(existing?.name ?? params.name ?? '');
  const [provider, setProvider] = useState(existing?.provider ?? params.provider ?? '');
  const [callName, setCallName] = useState(existing?.callName ?? params.callName ?? '');
  const [amount, setAmount] = useState(existing ? String(existing.amount) : '');
  const [status, setStatus] = useState<ProjectStatus>(existing?.status ?? 'podana');
  const [deadlines, setDeadlines] = useState<Partial<Record<DeadlineKind, ISODate>>>(
    existing?.deadlines ?? (params.podanie ? { podanie: params.podanie } : {}),
  );

  const save = () => {
    if (!name.trim()) {
      Alert.alert('Chýba názov', 'Zadajte názov projektu.');
      return;
    }
    const id = saveProject({
      id: existing?.id,
      name: name.trim(),
      provider: provider.trim(),
      callName: callName.trim(),
      amount: parseAmount(amount),
      status,
      deadlines,
    });
    router.back();
    if (!existing) setTimeout(() => router.push(`/project/${id}`), 350);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen
        options={{
          title: existing ? 'Upraviť projekt' : 'Nový projekt',
          headerLeft: () => (
            <Text onPress={() => router.back()} style={{ color: C.green, fontSize: 17 }}>
              Zrušiť
            </Text>
          ),
          headerRight: () => (
            <Text onPress={save} style={{ color: C.green, fontSize: 17, fontWeight: '700' }}>
              Uložiť
            </Text>
          ),
        }}
      />
      <Screen>
        <Field label="Názov projektu" value={name} onChangeText={setName} placeholder="napr. Obnova detského ihriska" autoFocus={!existing && !params.name} />
        <Field label="Poskytovateľ" value={provider} onChangeText={setProvider} placeholder="napr. Nadácia SPP, IROP, MK SR" />
        <Field label="Názov výzvy / programu" value={callName} onChangeText={setCallName} placeholder="napr. Dedina ožíva 2026" />
        <Field label="Žiadaná / schválená suma (€)" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="0" />

        <Section title="Stav">
          <ChipRow>
            {STATUS_ORDER.map((st) => (
              <Chip key={st} label={STATUS[st].label} active={status === st} onPress={() => setStatus(st)} />
            ))}
          </ChipRow>
        </Section>

        <Section title="Termíny">
          <Text style={[s.small, { marginTop: -4 }]}>Grantér vás na ne upozorní notifikáciou.</Text>
          <Card style={{ paddingVertical: 2 }}>
            {DEADLINE_ORDER.map((k, i) => (
              <View key={k} style={i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.border }}>
                <DateField label={DEADLINE_LABEL[k]} value={deadlines[k]} onChange={(v) => setDeadlines((d) => ({ ...d, [k]: v }))} />
              </View>
            ))}
          </Card>
        </Section>

        <Button label={existing ? 'Uložiť zmeny' : 'Vytvoriť projekt'} onPress={save} />
      </Screen>
    </KeyboardAvoidingView>
  );
}
