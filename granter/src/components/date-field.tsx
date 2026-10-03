import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, Text, TextInput, View } from 'react-native';

import { formatDate, parseISO, todayISO, toISO } from '@/lib/format';
import { C } from '@/lib/theme';
import type { ISODate } from '@/lib/types';

import { s } from './ui';

/** Voliteľný dátum: na iOS kompaktný natívny výber, na webe textové pole YYYY-MM-DD. */
export function DateField({ label, value, onChange }: { label: string; value?: ISODate; onChange: (v?: ISODate) => void }) {
  const [androidOpen, setAndroidOpen] = useState(false);

  return (
    <View style={[s.rowBetween, { alignItems: 'center', minHeight: 48 }]}>
      <Text style={{ fontSize: 16, color: C.ink, flex: 1 }}>{label}</Text>
      {!value ? (
        <Pressable onPress={() => onChange(todayISO())} hitSlop={8}>
          <Text style={{ color: C.green, fontWeight: '600', fontSize: 15 }}>+ Pridať</Text>
        </Pressable>
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {Platform.OS === 'ios' ? (
            <DateTimePicker
              value={parseISO(value)}
              mode="date"
              display="compact"
              locale="sk-SK"
              accentColor={C.green}
              onChange={(_, d) => d && onChange(toISO(d))}
            />
          ) : Platform.OS === 'android' ? (
            <>
              <Pressable onPress={() => setAndroidOpen(true)}>
                <Text style={{ fontSize: 15, color: C.ink }}>{formatDate(value)}</Text>
              </Pressable>
              {androidOpen && (
                <DateTimePicker
                  value={parseISO(value)}
                  mode="date"
                  onChange={(_, d) => {
                    setAndroidOpen(false);
                    if (d) onChange(toISO(d));
                  }}
                />
              )}
            </>
          ) : (
            <TextInput
              value={value}
              onChangeText={(t) => /^\d{4}-\d{2}-\d{2}$/.test(t) && onChange(t)}
              style={[s.input, { paddingVertical: 6, width: 130 }]}
            />
          )}
          <Pressable onPress={() => onChange(undefined)} hitSlop={10} accessibilityLabel={`Odstrániť ${label}`}>
            <Text style={{ color: C.faint, fontSize: 20 }}>×</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
