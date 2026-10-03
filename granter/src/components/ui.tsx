import { router } from 'expo-router';
import { ReactNode } from 'react';
import {
  Pressable,
  PressableProps,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { daysWord, eur, formatDate } from '@/lib/format';
import { C, DEADLINE_LABEL, serif, STATUS, urgency } from '@/lib/theme';
import type { Deadline, Project, ProjectStatus } from '@/lib/types';

export function Screen({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={[{ padding: 16, paddingBottom: 48, gap: 16 }, style]}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  );
}

export function Title({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[s.title, style]}>{children}</Text>;
}

export function Section({ title, right, children }: { title: string; right?: ReactNode; children: ReactNode }) {
  return (
    <View style={{ gap: 10 }}>
      <View style={s.sectionHead}>
        <Text style={s.sectionTitle}>{title}</Text>
        {right}
      </View>
      {children}
    </View>
  );
}

export function Card({ children, style, onPress }: { children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void }) {
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [s.card, pressed && { opacity: 0.7 }, style]}>
        {children}
      </Pressable>
    );
  }
  return <View style={[s.card, style]}>{children}</View>;
}

export function Badge({ status }: { status: ProjectStatus }) {
  const st = STATUS[status];
  return (
    <View style={[s.badge, { backgroundColor: st.bg }]}>
      <Text style={[s.badgeText, { color: st.fg }]}>{st.label.toUpperCase()}</Text>
    </View>
  );
}

export function Stat({ label, value, hint, highlight }: { label: string; value: string; hint?: string; highlight?: boolean }) {
  return (
    <View style={[s.stat, highlight && { backgroundColor: C.orangeSoft, borderColor: '#F0D57A' }]}>
      <Text style={[s.statLabel, highlight && { color: C.orange }]}>{label.toUpperCase()}</Text>
      <Text style={s.statValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      {hint ? <Text style={[s.statHint, highlight && { color: C.orange }]}>{hint}</Text> : null}
    </View>
  );
}

export function DaysBox({ days }: { days: number }) {
  const u = urgency(days);
  return (
    <View style={[s.daysBox, { backgroundColor: u.bg, borderColor: u.border }]}>
      <Text style={[s.daysNum, { color: u.fg }]}>{days}</Text>
      <Text style={[s.daysWord, { color: u.fg }]}>{daysWord(days).toUpperCase()}</Text>
    </View>
  );
}

export function DeadlineRow({ d }: { d: Deadline }) {
  return (
    <Card onPress={() => router.push(`/project/${d.projectId}`)} style={s.deadline}>
      <DaysBox days={d.days} />
      <View style={{ flex: 1 }}>
        <Text style={s.kicker}>{DEADLINE_LABEL[d.kind].toUpperCase()}</Text>
        <Text style={s.deadlineName} numberOfLines={1}>
          {d.projectName}
        </Text>
        <Text style={s.small}>{formatDate(d.date)}</Text>
      </View>
    </Card>
  );
}

export function Progress({ value }: { value: number }) {
  return (
    <View style={s.track}>
      <View style={[s.fill, { width: `${Math.round(Math.min(1, Math.max(0, value)) * 100)}%` }]} />
    </View>
  );
}

export function ProjectCard({ p }: { p: Project }) {
  const done = p.items.filter((i) => i.state === 'dorucene').length;
  return (
    <Card onPress={() => router.push(`/project/${p.id}`)} style={{ gap: 4 }}>
      <View style={s.rowBetween}>
        <Text style={s.projectName} numberOfLines={2}>
          {p.name}
        </Text>
        <Badge status={p.status} />
      </View>
      <Text style={s.small}>{p.provider}</Text>
      <View style={[s.rowBetween, { marginTop: 10, alignItems: 'center' }]}>
        <Text style={s.amount}>{eur(p.amount)}</Text>
        {p.items.length ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={s.small}>
              {done}/{p.items.length} položiek
            </Text>
            <View style={{ width: 48 }}>
              <Progress value={done / p.items.length} />
            </View>
          </View>
        ) : (
          <Text style={s.small}>—</Text>
        )}
      </View>
    </Card>
  );
}

type BtnProps = PressableProps & { label: string; variant?: 'primary' | 'secondary' | 'green' | 'danger'; small?: boolean };

export function Button({ label, variant = 'primary', small, style, ...rest }: BtnProps) {
  const v = {
    primary: { bg: C.ink, fg: '#fff', border: C.ink },
    green: { bg: C.green, fg: '#fff', border: C.green },
    secondary: { bg: C.surface, fg: C.ink, border: C.border },
    danger: { bg: C.surface, fg: C.red, border: '#F6B9B9' },
  }[variant];
  return (
    <Pressable
      accessibilityRole="button"
      {...rest}
      style={(state) => [
        s.btn,
        small && s.btnSmall,
        { backgroundColor: v.bg, borderColor: v.border },
        state.pressed && { opacity: 0.75 },
        rest.disabled && { opacity: 0.4 },
        typeof style === 'function' ? style(state) : style,
      ]}>
      <Text style={[s.btnText, small && { fontSize: 14 }, { color: v.fg }]}>{label}</Text>
    </Pressable>
  );
}

export function Chip({ label, active, onPress, count }: { label: string; active: boolean; onPress: () => void; count?: number }) {
  return (
    <Pressable onPress={onPress} style={[s.chip, active && s.chipActive]}>
      <Text style={[s.chipText, active && { color: '#fff' }]}>
        {label}
        {count !== undefined ? `  ${count}` : ''}
      </Text>
    </Pressable>
  );
}

export function ChipRow({ children }: { children: ReactNode }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
      {children}
    </ScrollView>
  );
}

export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={s.label}>{label}</Text>
      <TextInput placeholderTextColor={C.faint} {...props} style={[s.input, props.multiline && { minHeight: 90, textAlignVertical: 'top' }, props.style]} />
    </View>
  );
}

export function Check({ label, checked, onPress, right }: { label: string; checked: boolean; onPress: () => void; right?: ReactNode }) {
  return (
    <Pressable onPress={onPress} style={s.checkRow} accessibilityRole="checkbox" accessibilityState={{ checked }}>
      <View style={[s.box, checked && { backgroundColor: C.ink, borderColor: C.ink }]}>
        {checked ? <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>✓</Text> : null}
      </View>
      <Text style={{ flex: 1, fontSize: 15, color: C.ink }}>{label}</Text>
      {right}
    </Pressable>
  );
}

export function Empty({ text }: { text: string }) {
  return (
    <Card style={{ alignItems: 'center', paddingVertical: 28 }}>
      <Text style={[s.small, { textAlign: 'center' }]}>{text}</Text>
    </Card>
  );
}

export const s = StyleSheet.create({
  title: { fontFamily: serif, fontSize: 32, fontWeight: '700', color: C.ink, letterSpacing: -0.5 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontFamily: serif, fontSize: 20, fontWeight: '700', color: C.ink },
  card: {
    backgroundColor: C.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.border,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start' },
  badgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  stat: {
    flex: 1,
    backgroundColor: C.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.border,
    minWidth: 100,
  },
  statLabel: { fontSize: 10, color: C.muted, letterSpacing: 0.6, fontWeight: '600' },
  statValue: { fontSize: 24, fontWeight: '800', color: C.ink, marginTop: 4 },
  statHint: { fontSize: 11, color: C.muted, marginTop: 2 },
  daysBox: {
    width: 48,
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysNum: { fontSize: 20, fontWeight: '800' },
  daysWord: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  deadline: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  kicker: { fontSize: 10, color: C.muted, letterSpacing: 0.6, fontWeight: '600' },
  deadlineName: { fontSize: 16, color: C.ink, fontWeight: '600', marginTop: 1 },
  small: { fontSize: 13, color: C.muted },
  projectName: { fontSize: 16, fontWeight: '700', color: C.ink, flex: 1 },
  amount: { fontSize: 17, fontWeight: '700', color: C.ink },
  track: { height: 5, borderRadius: 3, backgroundColor: C.graySoft, overflow: 'hidden' },
  fill: { height: 5, borderRadius: 3, backgroundColor: '#1FA463' },
  btn: {
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSmall: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  btnText: { fontSize: 16, fontWeight: '600' },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
  },
  chipActive: { backgroundColor: C.ink, borderColor: C.ink },
  chipText: { fontSize: 14, color: C.ink, fontWeight: '500' },
  label: { fontSize: 13, color: C.muted, fontWeight: '600' },
  input: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: C.ink,
  },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: C.faint,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
