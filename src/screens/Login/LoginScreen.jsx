// src/screens/Login/LoginScreen.js
import {
  Box,
  Center,
  HStack,
  Image,
  Input,
  InputField,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import { useState } from 'react';
import LogoKoinonia from '../../../assets/images/logo_page4.png';
import { PrimaryButton } from '../../components/Buttons/PrimaryButton';
import { useAuth } from '../../context/AuthContext';

export function LoginScreen({ navigation }) {
  const { signIn, isLoadingAuth } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  async function handleLogin() {
    setError(null);
    try {
      await signIn(email, password);

      navigation.reset({
        index: 0,
        routes: [{ name: 'App' }],
      });
    } catch (e) {
      setError(e?.message || 'Erro ao fazer login');
    }
  }

  return (
    <Center flex={1} bg="$white">
      {/* CARD CENTRAL */}
      <Box
        w="90%"
        maxWidth={480}
        bg="$white"
        borderWidth={1}
        borderColor="$coolGray300"
        rounded="$lg"
        px="$10"
        py="$8"
        shadow="$2"
      >
        {/* LOGO */}
        <Image
          source={LogoKoinonia}
          alt="Progenos"
          resizeMode="contain"
          h={200}
          w="100%"
          alignSelf="center"
          mb="$6"
        />

        <VStack space="$4">
          {/* EMAIL */}
          <Box>
            <Text mb="$1" fontSize="$md">
              Email
            </Text>
            <Input>
              <InputField
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="Digite seu email"
              />
            </Input>
          </Box>

          {/* SENHA */}
          <Box mt="$2">
            <Text mb="$1" fontSize="$md">
              Senha
            </Text>
            <Input>
              <InputField
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Digite sua senha"
              />
            </Input>
          </Box>

          {error && (
            <Text color="$red600" mt="$2" textAlign="center">
              {error}
            </Text>
          )}

          {/* BOTÃO LOGIN */}
          <PrimaryButton
            mt="$6"
            alignSelf="center"
            w={160}
            onPress={handleLogin}
            isDisabled={isLoadingAuth}
          >
            {isLoadingAuth ? 'Entrando...' : 'Login'}
          </PrimaryButton>

          {/* LINK CRIAR CONTA */}
          <HStack mt="$4" justifyContent="center">
            <Text fontSize="$sm" color="$coolGray600">
              Não tem conta?
            </Text>
            <Text
              ml="$1"
              fontSize="$sm"
              color="$blue600"
              onPress={() => navigation.navigate('Register')}
              style={{ fontWeight: '600' }}
            >
              Criar conta
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Center>
  );
}
