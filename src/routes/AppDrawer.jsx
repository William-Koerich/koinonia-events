// src/routes/AppDrawer.js
import {
  Box,
  Image,
} from '@gluestack-ui/themed';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../context/AuthContext';

import { EventCreateScreen } from '../screens/EventCreate/EventCreateScreen';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { MyEventsScreen } from '../screens/MyEvents/MyEventsScreen';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';

import LogoProgenos from '../../assets/images/logo_page2.png';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <Box flex={1}>
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={{ paddingTop: 0 }}
        >
          <DrawerItemList {...props} />
        </DrawerContentScrollView>

        {/* Rodapé apenas com a logo, ocupando largura toda */}
        <Box mt="auto">
          <Image
            source={LogoProgenos}
            alt="Logo Koinonia"
            resizeMode="contain"
            h={150}        // aumenta aqui se quiser maior (70, 80...)
            w="100%"      // ocupa toda a largura do menu
          />
        </Box>
      </Box>
    </SafeAreaView>
  );
}

export function AppDrawer() {
  const { user } = useAuth();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Eventos' }}
      />

      <Drawer.Screen
        name="MyEvents"
        component={MyEventsScreen}
        options={{ title: 'Meus Eventos' }}
      />

      {user?.type === 'admin' && (
        <Drawer.Screen
          name="EventCreate"
          component={EventCreateScreen}
          options={{ title: 'Criar Evento' }}
        />
      )}

      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Perfil do Usuário' }}
      />
    </Drawer.Navigator>
  );
}
