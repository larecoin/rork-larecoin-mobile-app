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
    </Stack>
  );
}
