import { Ionicons } from '@expo/vector-icons';
import {
    HStack,
    Image,
    Pressable,
    Text,
    VStack
} from '@gluestack-ui/themed';
import LogoProgenos from '../../../assets/images/logo-progenos.png';

export default function Header({ user, handleGoHome, handleLogout }) {
    return (
        <HStack
        px="$8"
        pt="$8"
        pb="$4"
        alignItems="center"
        justifyContent="space-between"
      >
        <Image
          source={LogoProgenos}
          alt="Progenos"
          resizeMode="contain"
          h={60}
          w={200}
        />

        <HStack alignItems="center" space="$4">
          <VStack>
            <Text fontSize="$sm" color="$coolGray600">
              Você está logado como:
            </Text>
            <Text fontSize="$sm" color="#C75797">
              {user?.email || 'usuario@exemplo.com'}
            </Text>
          </VStack>

          <HStack space="$3" alignItems="center">
            <Pressable onPress={handleGoHome}>
              <Ionicons name="home" size={32} color="#707070" />
            </Pressable>

            <Pressable onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={32} color="#707070" />
            </Pressable>
          </HStack>
        </HStack>
      </HStack>
    )
}