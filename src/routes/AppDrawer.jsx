import { createDrawerNavigator } from '@react-navigation/drawer';
import { EventCreateScreen } from '../screens/EventCreate/EventCreateScreen';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { MyEventsScreen } from '../screens/MyEvents/MyEventsScreen';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';

const Drawer = createDrawerNavigator();

export function AppDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Eventos' }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Perfil do Usuário' }}
      />
      <Drawer.Screen 
        name="EventCreate"
        component={EventCreateScreen}
        options={{ title: 'Criar Evento'}}
      />
      <Drawer.Screen 
        name="MyEvents"
        component={MyEventsScreen}
        options={{ title: 'Meus Eventos'}}
      />

    </Drawer.Navigator>
  );
}
