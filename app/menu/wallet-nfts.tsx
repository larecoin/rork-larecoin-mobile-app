import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Wallet, Image as ImageIcon, Grid, List, Plus, Send, ArrowDownLeft } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const nfts = [
  { id: '1', name: 'Crypto Punk #1234', collection: 'CryptoPunks', image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=200&h=200&fit=crop', value: '12.5 ETH' },
  { id: '2', name: 'Bored Ape #5678', collection: 'BAYC', image: 'https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=200&h=200&fit=crop', value: '85 ETH' },
  { id: '3', name: 'Azuki #9012', collection: 'Azuki', image: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=200&h=200&fit=crop', value: '15 ETH' },
  { id: '4', name: 'Doodle #3456', collection: 'Doodles', image: 'https://images.unsplash.com/photo-1569437061241-a848be43cc82?w=200&h=200&fit=crop', value: '8 ETH' },
];

export default function WalletNFTsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, getTotalBalance, userTokens } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'tokens' | 'nfts'>('tokens');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'My Wallet & NFTs' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.balanceCard, { backgroundColor: colors.primary }]}>
          <Wallet size={32} color="#FFF" />
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceValue}>${getTotalBalance().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
          <View style={styles.balanceActions}>
            <TouchableOpacity style={styles.balanceAction}>
              <View style={styles.actionIcon}>
                <Send size={18} color={colors.primary} />
              </View>
              <Text style={styles.actionLabel}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.balanceAction}>
              <View style={styles.actionIcon}>
                <ArrowDownLeft size={18} color={colors.primary} />
              </View>
              <Text style={styles.actionLabel}>Receive</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.balanceAction}>
              <View style={styles.actionIcon}>
                <Plus size={18} color={colors.primary} />
              </View>
              <Text style={styles.actionLabel}>Buy</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'tokens' && { backgroundColor: colors.primary }]}
            onPress={() => setActiveTab('tokens')}
          >
            <Wallet size={18} color={activeTab === 'tokens' ? '#FFF' : colors.text} />
            <Text style={[styles.tabText, { color: activeTab === 'tokens' ? '#FFF' : colors.text }]}>Tokens</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'nfts' && { backgroundColor: colors.primary }]}
            onPress={() => setActiveTab('nfts')}
          >
            <ImageIcon size={18} color={activeTab === 'nfts' ? '#FFF' : colors.text} />
            <Text style={[styles.tabText, { color: activeTab === 'nfts' ? '#FFF' : colors.text }]}>NFTs</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'tokens' ? (
          <View style={styles.section}>
            {userTokens.map((token) => (
              <TouchableOpacity
                key={token.id}
                style={[styles.tokenCard, { backgroundColor: colors.surface }]}
              >
                <View style={[styles.tokenIcon, { backgroundColor: token.color + '20' }]}>
                  <Text style={[styles.tokenSymbol, { color: token.color }]}>{token.symbol[0]}</Text>
                </View>
                <View style={styles.tokenInfo}>
                  <Text style={[styles.tokenName, { color: colors.text }]}>{token.name}</Text>
                  <Text style={[styles.tokenBalance, { color: colors.textTertiary }]}>
                    {token.balance} {token.symbol}
                  </Text>
                </View>
                <View style={styles.tokenValue}>
                  <Text style={[styles.tokenUsd, { color: colors.text }]}>
                    ${(token.balance * token.usdValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                  <Text style={[
                    styles.tokenChange,
                    { color: token.change24h >= 0 ? colors.success : colors.error }
                  ]}>
                    {token.change24h >= 0 ? '+' : ''}{token.change24h}%
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.nftHeader}>
              <Text style={[styles.nftCount, { color: colors.text }]}>{nfts.length} NFTs</Text>
              <View style={styles.viewToggle}>
                <TouchableOpacity 
                  style={[styles.viewButton, viewMode === 'grid' && { backgroundColor: colors.surface }]}
                  onPress={() => setViewMode('grid')}
                >
                  <Grid size={18} color={viewMode === 'grid' ? colors.primary : colors.textTertiary} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.viewButton, viewMode === 'list' && { backgroundColor: colors.surface }]}
                  onPress={() => setViewMode('list')}
                >
                  <List size={18} color={viewMode === 'list' ? colors.primary : colors.textTertiary} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.nftGrid}>
              {nfts.map((nft) => (
                <TouchableOpacity
                  key={nft.id}
                  style={[styles.nftCard, { backgroundColor: colors.surface }]}
                >
                  <Image source={{ uri: nft.image }} style={styles.nftImage} />
                  <View style={styles.nftInfo}>
                    <Text style={[styles.nftName, { color: colors.text }]} numberOfLines={1}>{nft.name}</Text>
                    <Text style={[styles.nftCollection, { color: colors.textTertiary }]}>{nft.collection}</Text>
                    <Text style={[styles.nftValue, { color: colors.primary }]}>{nft.value}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  balanceCard: {
    margin: 16,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 12,
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: '#FFF',
    marginTop: 4,
  },
  balanceActions: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 24,
  },
  balanceAction: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '500' as const,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 10,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  section: {
    paddingHorizontal: 16,
  },
  tokenCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  tokenIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tokenSymbol: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  tokenInfo: {
    flex: 1,
  },
  tokenName: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  tokenBalance: {
    fontSize: 13,
  },
  tokenValue: {
    alignItems: 'flex-end',
  },
  tokenUsd: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  tokenChange: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  nftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  nftCount: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  viewToggle: {
    flexDirection: 'row',
    gap: 4,
  },
  viewButton: {
    padding: 8,
    borderRadius: 8,
  },
  nftGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  nftCard: {
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  nftImage: {
    width: '100%',
    aspectRatio: 1,
  },
  nftInfo: {
    padding: 10,
  },
  nftName: {
    fontSize: 13,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  nftCollection: {
    fontSize: 11,
    marginBottom: 4,
  },
  nftValue: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
});
