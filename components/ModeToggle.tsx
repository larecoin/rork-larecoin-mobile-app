import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Wallet, Store } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AppMode, useApp } from '@/contexts/AppContext';

export default function ModeToggle() {
  const { mode, switchMode, colors } = useApp();
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(mode === 'wallet' ? 0 : 1)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: mode === 'wallet' ? 0 : 1,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();
  }, [mode, slideAnim]);

  const handleToggle = (newMode: AppMode) => {
    if (newMode !== mode) {
      switchMode(newMode);
      if (newMode === 'merchant') {
        router.push('/(tabs)/(merchant)/dashboard');
      } else {
        router.push('/(tabs)/(wallet)');
      }
    }
  };

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 56],
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Animated.View 
        style={[
          styles.slider,
          { transform: [{ translateX }], backgroundColor: '#5AC8FA' }
        ]} 
      />
      <TouchableOpacity
        style={styles.option}
        onPress={() => handleToggle('wallet')}
        activeOpacity={0.7}
      >
        <Wallet 
          size={16} 
          color={mode === 'wallet' ? colors.background : colors.textSecondary} 
        />
        <Text style={[
          styles.optionText,
          { color: mode === 'wallet' ? colors.background : colors.textSecondary }
        ]}>
          Wallet
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.option}
        onPress={() => handleToggle('merchant')}
        activeOpacity={0.7}
      >
        <Store 
          size={16} 
          color={mode === 'merchant' ? colors.background : colors.textSecondary} 
        />
        <Text style={[
          styles.optionText,
          { color: mode === 'merchant' ? colors.background : colors.textSecondary }
        ]}>
          Merchant
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 2,
    position: 'relative',
  },
  slider: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 56,
    height: 26,
    borderRadius: 14,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 26,
    gap: 3,
    zIndex: 1,
  },
  optionText: {
    fontSize: 9,
    fontWeight: '600' as const,
  },
});
