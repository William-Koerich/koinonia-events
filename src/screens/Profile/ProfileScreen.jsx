// src/screens/Profile/ProfileScreen.js
import {
  Box,
  Button,
  ButtonText,
  Center,
  Heading,
  Text,
} from '@gluestack-ui/themed';
import { useAuth } from '../../context/AuthContext';

export function ProfileScreen({ navigation }) {
  const { user, signOut } = useAuth();

  async function handleLogout() {
    try {
      await signOut();

      // reseta navegação pra não deixar o usuário voltar pro app logado
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (err) {
      console.log('[ProfileScreen] erro ao fazer logout:', err);
    }
  }

  return (
    <Center flex={1} px="$4">
      <Box>
        <Heading mb="$2">Perfil do Usuário</Heading>
        <Text mb="$1">Nome: {user?.name}</Text>
        <Text mb="$4">E-mail: {user?.email}</Text>

        <Button onPress={handleLogout}>
          <ButtonText>Sair</ButtonText>
        </Button>
      </Box>
    </Center>
  );
}
