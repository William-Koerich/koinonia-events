import { Image, View } from "react-native";
import LogoSplash from '../../../assets/images/logo-splash.png';

export default function Splash() {
  return (
    <View
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
    >
      <Image
        source={LogoSplash}
        resizeMode="contain"
        style={{
          width: '50%',  // metade da largura disponível
          height: undefined,
          aspectRatio: 3 / 1, // ou outra proporção que se aproxime
        }}
      />
    </View>
  );
}
