// src/routes/RootNavigator.js
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EventRegisterScreen } from '../screens/EventRegister/EventRegisterScreen';
import { LoginScreen } from '../screens/Login/LoginScreen';
import { AppDrawer } from './AppDrawer';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Login"
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="App" component={AppDrawer} />
        <Stack.Screen
          name="EventRegister"
          component={EventRegisterScreen}
          options={{
            headerShown: true,
            title: 'Detalhes do evento',
            headerBackTitleVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
