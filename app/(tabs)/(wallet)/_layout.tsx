import { Stack } from 'expo-router';
import Colors from '@/constants/colors';

export default function WalletLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.text,
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen 
        name="send" 
        options={{ 
          title: 'Send',
          presentation: 'modal',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="receive" 
        options={{ 
          title: 'Receive',
          presentation: 'modal',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="transactions" 
        options={{ 
          title: 'Transactions',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="request-payment" 
        options={{ 
          title: 'Request Payment',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="staking" 
        options={{ 
          title: 'Staking',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="bonds" 
        options={{ 
          title: 'Bonds',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="pools" 
        options={{ 
          title: 'Liquidity Pools',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="lucky-draws" 
        options={{ 
          title: 'Lucky Draws',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="kyc-aml" 
        options={{ 
          title: 'KYC & AML',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="bridge" 
        options={{ 
          title: 'Bridge',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="borrow-lend" 
        options={{ 
          title: 'Borrow & Lend',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="dao" 
        options={{ 
          title: 'DAO Governance',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="card-manager" 
        options={{ 
          title: 'Card Manager',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="buy" 
        options={{ 
          title: 'Buy Crypto',
          presentation: 'modal',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="sell" 
        options={{ 
          title: 'Sell Crypto',
          presentation: 'modal',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="swap" 
        options={{ 
          title: 'Swap Tokens',
          presentation: 'modal',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="spot-trading" 
        options={{ 
          title: 'Spot Trading',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="crypto-to-crypto" 
        options={{ 
          title: 'Crypto to Crypto',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="fiat-exchange" 
        options={{ 
          title: 'Fiat Exchange',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="dex-swap" 
        options={{ 
          title: 'DEX Swap',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="liquidity-mining" 
        options={{ 
          title: 'Liquidity Mining',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="yield-farming" 
        options={{ 
          title: 'Yield Farming',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="nft-trading" 
        options={{ 
          title: 'NFT Trading',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="arbitrage" 
        options={{ 
          title: 'Arbitrage',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="ido-ieo" 
        options={{ 
          title: 'IDO / IEO',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="margin-trading" 
        options={{ 
          title: 'Margin Trading',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="futures" 
        options={{ 
          title: 'Futures',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="perpetuals" 
        options={{ 
          title: 'Perpetuals',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="options" 
        options={{ 
          title: 'Options',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="cfds" 
        options={{ 
          title: 'CFDs',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="leveraged-tokens" 
        options={{ 
          title: 'Leveraged Tokens',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="copy-trading" 
        options={{ 
          title: 'Copy Trading',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="grid-bots" 
        options={{ 
          title: 'Grid Bots',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="dca-bots" 
        options={{ 
          title: 'DCA Bots',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="prediction-markets" 
        options={{ 
          title: 'Prediction Markets',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="event-trading" 
        options={{ 
          title: 'Event Trading',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="flash-loans" 
        options={{ 
          title: 'Flash Loans',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
    </Stack>
  );
}
