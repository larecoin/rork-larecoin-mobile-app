import { Stack } from 'expo-router';
import Colors from '@/constants/colors';

export default function MerchantLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.text,
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="ads" options={{ headerShown: false }} />
      <Stack.Screen name="myshop" options={{ headerShown: false }} />
      <Stack.Screen name="apps" options={{ headerShown: false }} />
      <Stack.Screen name="contacts" options={{ headerShown: false }} />
      <Stack.Screen name="merchantorders" options={{ headerShown: false }} />
      <Stack.Screen 
        name="catalog" 
        options={{ 
          title: 'Product Catalog',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="orders" 
        options={{ 
          title: 'Orders',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen 
        name="payment" 
        options={{ 
          title: 'Quick Payment',
          presentation: 'modal',
          headerStyle: { backgroundColor: Colors.backgroundSecondary },
        }} 
      />
      <Stack.Screen name="inventory" options={{ headerShown: false }} />
      <Stack.Screen name="hr-payroll" options={{ headerShown: false }} />
      <Stack.Screen name="gift-certificates" options={{ headerShown: false }} />
      <Stack.Screen name="statements-reports" options={{ headerShown: false }} />
      <Stack.Screen name="bill-pay" options={{ headerShown: false }} />
      <Stack.Screen name="receipts" options={{ headerShown: false }} />
    </Stack>
  );
}
