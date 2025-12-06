// src/screens/Register/RegisterScreen.js
import {
    Box,
    Center,
    HStack,
    Input,
    InputField,
    Text,
    VStack,
} from '@gluestack-ui/themed';
import { useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { PrimaryButton } from '../../components/Buttons/PrimaryButton';

const API_URL = 'http://localhost:3333'; 
// 👉 se for testar no celular físico, troca pra IP da sua máquina, ex: http://192.168.0.10:3333

export function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaConfirmacao, setSenhaConfirmacao] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleRegister() {
    setError(null);

    if (!nome.trim() || !email.trim() || !senha.trim()) {
      setError('Preencha nome, email e senha.');
      return;
    }

    if (senha !== senhaConfirmacao) {
      setError('As senhas não conferem.');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Erro ao criar conta');
      }

      Alert.alert(
        'Conta criada',
        'Sua conta foi criada com sucesso! Faça login para continuar.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (e) {
      console.log('[RegisterScreen] erro:', e);
      setError(e.message || 'Erro ao criar conta');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box flex={1} bg="#F3F4F6">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Center flex={1} px="$5" py="$8">
          <Box
            w="100%"
            maxWidth={480}
            bg="$white"
            borderRadius="$2xl"
            borderWidth={1}
            borderColor="$coolGray200"
            px="$6"
            py="$6"
            shadow="$3"
          >
            {/* Cabeçalho */}
            <VStack space="$1" mb="$6" alignItems="center">
              <Text
                fontSize="$xs"
                color="$coolGray500"
                mb="$1"
              >
                Novo por aqui?
              </Text>

              <Text
                fontSize="$xl"
                color="$coolGray900"
                style={{ fontWeight: '600' }}
              >
                Criar conta
              </Text>

              <Text
                fontSize="$sm"
                color="$coolGray500"
                textAlign="center"
                mt="$1"
              >
                Preencha seus dados para se inscrever nos eventos
                e acompanhar suas inscrições.
              </Text>
            </VStack>

            <VStack space="$4">
              {/* NOME */}
              <Box>
                <Text mb="$1" fontSize="$sm" color="$coolGray700">
                  Nome completo
                </Text>
                <Input
                  bg="$coolGray50"
                  borderColor="$coolGray200"
                  rounded="$lg"
                >
                  <InputField
                    value={nome}
                    onChangeText={setNome}
                    placeholder="Ex: João da Silva"
                  />
                </Input>
              </Box>

              {/* EMAIL */}
              <Box>
                <Text mb="$1" fontSize="$sm" color="$coolGray700">
                  Email
                </Text>
                <Input
                  bg="$coolGray50"
                  borderColor="$coolGray200"
                  rounded="$lg"
                >
                  <InputField
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="Digite seu email"
                  />
                </Input>
              </Box>

              {/* SENHAS */}
              <VStack space="$3" mt="$2">
                <Box>
                  <Text mb="$1" fontSize="$sm" color="$coolGray700">
                    Senha
                  </Text>
                  <Input
                    bg="$coolGray50"
                    borderColor="$coolGray200"
                    rounded="$lg"
                  >
                    <InputField
                      value={senha}
                      onChangeText={setSenha}
                      secureTextEntry
                      placeholder="Crie uma senha"
                    />
                  </Input>
                </Box>

                <Box>
                  <Text mb="$1" fontSize="$sm" color="$coolGray700">
                    Confirmar senha
                  </Text>
                  <Input
                    bg="$coolGray50"
                    borderColor="$coolGray200"
                    rounded="$lg"
                  >
                    <InputField
                      value={senhaConfirmacao}
                      onChangeText={setSenhaConfirmacao}
                      secureTextEntry
                      placeholder="Repita a senha"
                    />
                  </Input>
                </Box>

                <Text fontSize="$xs" color="$coolGray500">
                  A senha deve ter pelo menos 6 caracteres.
                </Text>
              </VStack>

              {error && (
                <Text color="$red600" mt="$1" textAlign="center">
                  {error}
                </Text>
              )}

              {/* BOTÃO CRIAR CONTA */}
              <PrimaryButton
                mt="$4"
                alignSelf="center"
                w="100%"
                onPress={handleRegister}
                isDisabled={isSubmitting}
              >
                {isSubmitting ? 'Criando conta...' : 'Criar conta'}
              </PrimaryButton>

              {/* VOLTAR PARA LOGIN */}
              <HStack mt="$4" justifyContent="center">
                <Text fontSize="$sm" color="$coolGray600">
                  Já tem conta?
                </Text>
                <Text
                  ml="$1"
                  fontSize="$sm"
                  color="$blue600"
                  onPress={() => navigation.goBack()}
                  style={{ fontWeight: '600' }}
                >
                  Fazer login
                </Text>
              </HStack>
            </VStack>
          </Box>
        </Center>
      </ScrollView>
    </Box>
  );
}
