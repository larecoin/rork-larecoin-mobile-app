import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { QrCode, Camera, Image, Flashlight, FlashlightOff } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function ScanQRScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const [flashEnabled, setFlashEnabled] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Scan QR Code' }} />
      
      <View style={styles.cameraContainer}>
        <View style={[styles.cameraPlaceholder, { backgroundColor: colors.surface }]}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft, { borderColor: colors.primary }]} />
            <View style={[styles.corner, styles.topRight, { borderColor: colors.primary }]} />
            <View style={[styles.corner, styles.bottomLeft, { borderColor: colors.primary }]} />
            <View style={[styles.corner, styles.bottomRight, { borderColor: colors.primary }]} />
          </View>
          <Camera size={64} color={colors.textTertiary} />
          <Text style={[styles.placeholderText, { color: colors.textTertiary }]}>
            <Text>Camera preview will appear here</Text>
          </Text>
          <Text style={[styles.placeholderSubtext, { color: colors.textTertiary }]}>
            <Text>Position QR code within the frame</Text>
          </Text>
        </View>
      </View>

      <View style={[styles.controls, { backgroundColor: colors.surface }]}>
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={() => setFlashEnabled(!flashEnabled)}
        >
          <View style={[styles.controlIcon, { backgroundColor: flashEnabled ? colors.primary : colors.background }]}>
            {flashEnabled ? (
              <Flashlight size={24} color="#FFF" />
            ) : (
              <FlashlightOff size={24} color={colors.text} />
            )}
          </View>
          <Text style={[styles.controlLabel, { color: colors.text }]}>Flash</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton}>
          <View style={[styles.controlIcon, { backgroundColor: colors.background }]}>
            <Image size={24} color={colors.text} />
          </View>
          <Text style={[styles.controlLabel, { color: colors.text }]}>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton}>
          <View style={[styles.controlIcon, { backgroundColor: colors.background }]}>
            <QrCode size={24} color={colors.text} />
          </View>
          <Text style={[styles.controlLabel, { color: colors.text }]}>My QR</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.infoSection, { paddingBottom: insets.bottom + 20 }]}>
        <Text style={[styles.infoTitle, { color: colors.text }]}>Scan to:</Text>
        <View style={styles.infoItems}>
          <View style={[styles.infoItem, { backgroundColor: colors.surface }]}>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>💸 Send or receive payments</Text>
          </View>
          <View style={[styles.infoItem, { backgroundColor: colors.surface }]}>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>🔗 Connect with friends</Text>
          </View>
          <View style={[styles.infoItem, { backgroundColor: colors.surface }]}>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>🛒 Pay at merchants</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    padding: 20,
  },
  cameraPlaceholder: {
    flex: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  scanFrame: {
    position: 'absolute',
    width: 250,
    height: 250,
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 12,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '500' as const,
    marginTop: 16,
  },
  placeholderSubtext: {
    fontSize: 13,
    marginTop: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    marginHorizontal: 20,
    borderRadius: 16,
  },
  controlButton: {
    alignItems: 'center',
  },
  controlIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  controlLabel: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  infoSection: {
    padding: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  infoItems: {
    gap: 8,
  },
  infoItem: {
    padding: 12,
    borderRadius: 10,
  },
  infoText: {
    fontSize: 14,
  },
});
