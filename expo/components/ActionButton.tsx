import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
}

export default function ActionButton({ 
  icon: Icon, 
  label, 
  onPress, 
  variant = 'primary' 
}: ActionButtonProps) {
  const { colors: themeColors } = useApp();

  const getColors = () => {
    switch (variant) {
      case 'primary':
        return { bg: '#5AC8FA', text: '#FFFFFF' };
      case 'secondary':
        return { bg: '#89CFF0', text: '#FFFFFF' };
      case 'accent':
        return { bg: '#6BB3F0', text: '#FFFFFF' };
    }
  };

  const btnColors = getColors();

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: btnColors.bg }]}>
        <Icon size={22} color={btnColors.text} strokeWidth={2.5} />
      </View>
      <Text style={[styles.label, { color: themeColors.text }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
});
