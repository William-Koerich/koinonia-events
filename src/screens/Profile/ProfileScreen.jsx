import {
    Box,
    Button,
    ButtonText,
    Center,
    Heading,
    Text,
} from '@gluestack-ui/themed';
import { useAuth } from '../../context/AuthContext';

export function ProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <Center flex={1} px="$4">
      <Box>
        <Heading mb="$2">Perfil do Usuário</Heading>
        <Text mb="$1">Nome: {user?.name}</Text>
        <Text mb="$4">E-mail: {user?.email}</Text>

        <Button onPress={signOut}>
          <ButtonText>Sair</ButtonText>
        </Button>
      </Box>
    </Center>
  );
}
