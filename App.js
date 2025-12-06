// App.js
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { config } from './gluestack-ui.config';
import { AuthProvider } from './src/context/AuthContext';
import { runSplashChecks } from './src/helpers/version';
import { RootNavigator } from './src/routes/RootNavigator';
import { UpdateVersion } from './src/UpdateVersion/UpdateVersion';


export default function App() {
    const [fontsLoaded] = useFonts({
      'Nunito-Black': require('./assets/fonts/Nunito-Black.ttf'),
      'Nunito-BlackItalic': require('./assets/fonts/Nunito-BlackItalic.ttf'),

      'Nunito-Bold': require('./assets/fonts/Nunito-Bold.ttf'),
      'Nunito-BoldItalic': require('./assets/fonts/Nunito-BoldItalic.ttf'),

      'Nunito-ExtraBold': require('./assets/fonts/Nunito-ExtraBold.ttf'),
      'Nunito-ExtraBoldItalic': require('./assets/fonts/Nunito-ExtraBoldItalic.ttf'),

      'Nunito-ExtraLight': require('./assets/fonts/Nunito-ExtraLight.ttf'),
      'Nunito-ExtraLightItalic': require('./assets/fonts/Nunito-ExtraLightItalic.ttf'),

      'Nunito-Italic': require('./assets/fonts/Nunito-Italic.ttf'),

      'Nunito-Light': require('./assets/fonts/Nunito-Light.ttf'),
      'Nunito-LightItalic': require('./assets/fonts/Nunito-LightItalic.ttf'),

      'Nunito-Medium': require('./assets/fonts/Nunito-Medium.ttf'),
      'Nunito-MediumItalic': require('./assets/fonts/Nunito-MediumItalic.ttf'),

      'Nunito-Regular': require('./assets/fonts/Nunito-Regular.ttf'),

      'Nunito-SemiBold': require('./assets/fonts/Nunito-SemiBold.ttf'),
      'Nunito-SemiBoldItalic': require('./assets/fonts/Nunito-SemiBoldItalic.ttf')
    });
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await runSplashChecks();
      } catch (e) {
        console.log('Erro nos checks de splash:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    // retorna null pra manter a splash nativa
    return null;
  }

  return (
    <GluestackUIProvider config={config}>
      <UpdateVersion>
        <AuthProvider>
          <View style={{ flex: 1 }} onLayout={onLayoutRootView} >
            <RootNavigator />
          </View>
        </AuthProvider>
      </UpdateVersion>
    </GluestackUIProvider>
  );
}
