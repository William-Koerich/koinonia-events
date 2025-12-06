// src/screens/SearchTerm/SearchTermScreen.jsx
import { Ionicons } from '@expo/vector-icons';
import {
    Box,
    HStack,
    Input,
    InputField,
    Pressable,
    Text,
    VStack
} from '@gluestack-ui/themed';
import { useState } from 'react';
import { ScrollView, useWindowDimensions } from 'react-native';
import Header from '../../components/Header/Header';

import { PrimaryButton } from '../../components/Buttons/PrimaryButton';
import { useAuth } from '../../context/AuthContext';

export function SearchTermScreen({ navigation }) {
    const { width, height } = useWindowDimensions();
    const isPortrait = height >= width;
  const { user, signOut } = useAuth();

  const [idTcle, setIdTcle] = useState('');
  const [numeroPareamento, setNumeroPareamento] = useState('');
  const [cpf, setCpf] = useState('');

  const [termData, setTermData] = useState(null);
  const [viewMode, setViewMode] = useState('form'); // 'form' | 'result'

  const MOCK_TERM = {
    idTcle: '1234-abcde-4321-6547-asffg',
    patientId: '123456',
    cpf: '999.999.999-99',
    pairingNumber: '8888888',
    name: 'João Silva',
    signingDate: '20/11/2025',
    birthDate: '05/05/1950',
    ethnicity: 'Caucasiano',
    sex: 'Masculino',
  };

  function handleLogout() {
    signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }

  function handleGoHome() {
    navigation.navigate('Home');
  }

  function handleBack() {
    if (viewMode === 'result') {
      // volta para o formulário em vez de sair da tela
      setViewMode('form');
      return;
    }

    navigation.goBack();
  }

  function handleSearchById() {
    console.log('Pesquisar por Identificador:', idTcle);
    // TODO: chamada de API real
    setTermData(MOCK_TERM);
    setViewMode('result');
  }

  function handleSearchByPairing() {
    console.log('Pesquisar por Número de Pareamento:', numeroPareamento);
    setTermData(MOCK_TERM);
    setViewMode('result');
  }

  function handleSearchByCpf() {
    console.log('Pesquisar por CPF:', cpf);
    setTermData(MOCK_TERM);
    setViewMode('result');
  }

  function handleOpenFilters() {
    console.log('Abrir filtros avançados');
  }

  return (
    <Box flex={1} bg="$white">
      {/* HEADER TOPO */}
        <Header 
            user={user}
            handleGoHome={handleGoHome}
            handleLogout={handleLogout}
        />

      <Box h={1} bg="$coolGray300" mx="$8" />

      {/* CONTEÚDO */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 32,
          paddingVertical: 24,
          alignItems: 'center',
        }}
      >
        <Box w="100%" maxWidth={900}>
          {/* Voltar */}
          <Pressable onPress={handleBack}>
            <Box
              w={40}
              h={40}
              rounded="$full"
              bg="#452E84"
              alignItems="center"
              justifyContent="center"
            >
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </Box>
          </Pressable>

          {/* Título */}
          {
            !termData && (
            <Box mt="$6" mb="$3" alignItems="center">
                <Text fontSize="$xl" fontWeight="$semibold" color="$coolGray800">
                    Pesquisar Termo
                </Text>
            </Box>
            )
          }
          
          {/* FORM OU RESULTADO */}
          {viewMode === 'form' ? (
            <>
              {/* Subtítulo + Filtro */}
              <HStack
                mb="$6"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box flex={1} alignItems="center">
                  <Text textAlign="center" color="$coolGray700">
                    Pesquise o TCLE pelo{' '}
                    <Text fontWeight="$semibold">Identificador</Text>,{' '}
                    <Text fontWeight="$semibold">Número de Pareamento</Text> ou{' '}
                    <Text fontWeight="$semibold">CPF</Text> do paciente
                  </Text>
                </Box>

                <Pressable onPress={handleOpenFilters}>
                  <HStack alignItems="center" space="$1">
                    <Text color="#C75797" fontWeight="$semibold">
                      Filtrar
                    </Text>
                    <Ionicons name="filter" size={18} color="#C75797" />
                  </HStack>
                </Pressable>
              </HStack>

              {/* Linha 1 - ID TCLE */}
              <Box mb="$3">
                <Text mb="$1">Identificador TCLE</Text>

                <HStack alignItems="center" space="$3">
                  <Input flex={1}>
                    <InputField
                      value={idTcle}
                      onChangeText={setIdTcle}
                      placeholder="Digite o ID do TCLE"
                    />
                  </Input>

                  <PrimaryButton w={140} onPress={handleSearchById}>
                    Pesquisar
                  </PrimaryButton>
                </HStack>
              </Box>

              {/* Linha 2 - Número de Pareamento */}
              <Box mb="$3">
                <Text mb="$1">Número de Pareamento</Text>

                <HStack alignItems="center" space="$3">
                  <Input flex={1}>
                    <InputField
                      value={numeroPareamento}
                      onChangeText={setNumeroPareamento}
                      placeholder="Digite o Número de Pareamento"
                    />
                  </Input>

                  <PrimaryButton w={140} onPress={handleSearchByPairing}>
                    Pesquisar
                  </PrimaryButton>
                </HStack>
              </Box>

              {/* Linha 3 - CPF */}
              <Box mb="$3">
                <Text mb="$1">CPF</Text>

                <HStack alignItems="center" space="$3">
                  <Input flex={1}>
                    <InputField
                      value={cpf}
                      onChangeText={setCpf}
                      placeholder="Digite o CPF"
                    />
                  </Input>

                  <PrimaryButton w={140} onPress={handleSearchByCpf}>
                    Pesquisar
                  </PrimaryButton>
                </HStack>
              </Box>
            </>
          ) : (
            termData && (
                <Box mt="$4">
                    <Text fontSize="$lg" fontWeight="$bold" mb="$3">
                        Termo Solicitado:
                    </Text>

                    <VStack space="$4">
                    {/* Linha(s) superiores */}
                    {isPortrait ? (
                        <>
                        {/* Vertical: quebra em 2 linhas */}
                        <HStack space="$3">
                            <Box flex={1}>
                            <Text mb="$1">ID TCLE</Text>
                            <Box bg="$coolGray300" px="$2" py="$1">
                                <Text>{termData.idTcle}</Text>
                            </Box>
                            </Box>

                            <Box flex={1}>
                            <Text mb="$1">ID Patient</Text>
                            <Box bg="$coolGray300" px="$2" py="$1">
                                <Text>{termData.patientId}</Text>
                            </Box>
                            </Box>

                            <Box flex={1}>
                            <Text mb="$1">CPF</Text>
                            <Box bg="$coolGray300" px="$2" py="$1">
                                <Text>{termData.cpf}</Text>
                            </Box>
                            </Box>
                        </HStack>

                        <HStack space="$3">
                            <Box flex={1}>
                            <Text mb="$1">N.º pareamento</Text>
                            <Box bg="$coolGray300" px="$2" py="$1">
                                <Text>{termData.pairingNumber}</Text>
                            </Box>
                            </Box>

                            <Box flex={1}>
                            <Text mb="$1">Nome</Text>
                            <Box bg="$coolGray300" px="$2" py="$1">
                                <Text>{termData.name}</Text>
                            </Box>
                            </Box>

                            <Box flex={1}>
                            <Text mb="$1">Data Assinatura</Text>
                            <Box bg="$coolGray300" px="$2" py="$1">
                                <Text>{termData.signingDate}</Text>
                            </Box>
                            </Box>
                        </HStack>
                        </>
                    ) : (
                        /* Horizontal: tudo numa linha só, como já estava */
                        <HStack space="$5">
                        <Box flex={1}>
                            <Text mb="$1">ID TCLE</Text>
                            <Box bg="$coolGray300" px="$2" py="$1">
                            <Text>{termData.idTcle}</Text>
                            </Box>
                        </Box>

                        <Box flex={1}>
                            <Text mb="$1">ID Patient</Text>
                            <Box bg="$coolGray300" px="$2" py="$1">
                            <Text>{termData.patientId}</Text>
                            </Box>
                        </Box>

                        <Box >
                            <Text mb="$1">CPF</Text>
                            <Box bg="$coolGray300" px="$2" py="$1">
                            <Text>{termData.cpf}</Text>
                            </Box>
                        </Box>

                        <Box >
                            <Text mb="$1">N.º pareamento</Text>
                            <Box bg="$coolGray300" px="$2" py="$1">
                            <Text>{termData.pairingNumber}</Text>
                            </Box>
                        </Box>

                        <Box >
                            <Text mb="$1">Nome</Text>
                            <Box bg="$coolGray300" px="$2" py="$1">
                            <Text>{termData.name}</Text>
                            </Box>
                        </Box>

                        <Box >
                            <Text mb="$1">Data Assinatura</Text>
                            <Box bg="$coolGray300" px="$2" py="$1">
                            <Text>{termData.signingDate}</Text>
                            </Box>
                        </Box>
                        </HStack>
                    )}

                    {/* Linha de baixo – igual em ambos */}
                    <HStack space="$3">
                        <Box flex={1}>
                        <Text mb="$1">Data de nascimento</Text>
                        <Box bg="$coolGray300" px="$2" py="$1">
                            <Text>{termData.birthDate}</Text>
                        </Box>
                        </Box>

                        <Box flex={1}>
                        <Text mb="$1">Etnia</Text>
                        <Box bg="$coolGray300" px="$2" py="$1">
                            <Text>{termData.ethnicity}</Text>
                        </Box>
                        </Box>

                        <Box flex={1}>
                        <Text mb="$1">Sexo</Text>
                        <Box bg="$coolGray300" px="$2" py="$1">
                            <Text>{termData.sex}</Text>
                        </Box>
                        </Box>
                    </HStack>
                    </VStack>
                </Box>
            )
          )}
        </Box>
      </ScrollView>
    </Box>
  );
}
