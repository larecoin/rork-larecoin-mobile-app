import { Stack } from 'expo-router';
import { useApp } from '@/contexts/AppContext';

export default function MenuLayout() {
  const { colors } = useApp();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerBackTitle: 'Back',
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
