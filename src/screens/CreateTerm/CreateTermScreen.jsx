import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
    Box,
    HStack,
    Input,
    InputField,
    Pressable,
    Select,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectIcon,
    SelectInput,
    SelectItem,
    SelectPortal,
    SelectTrigger,
    Text,
    Textarea,
    TextareaInput,
    VStack
} from '@gluestack-ui/themed';
import { useState } from 'react';
import { ScrollView } from 'react-native';

import { PrimaryButton } from '../../components/Buttons/PrimaryButton';
import Header from '../../components/Header/Header';
import { useAuth } from '../../context/AuthContext';

export function CreateTermScreen({ navigation }) {
  const { user, signOut } = useAuth();

  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [etnia, setEtnia] = useState('');
  const [horasJejum, setHorasJejum] = useState('');
  const [sexo, setSexo] = useState('');
  const [tipo, setTipo] = useState('');
  const [obs, setObs] = useState('');
  const [numeroPareamento, setNumeroPareamento] = useState('');

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
    navigation.goBack();
  }

  function handleContinue() {
    console.log('Continuar com o cadastro de termo');
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
        {/* container central para “encolher” o formulário */}
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
          <Box mt="$6" mb="$5" alignItems="center">
            <Text fontSize="$xl" fontWeight="$semibold" color="$coolGray800">
              Cadastrar Termo
            </Text>
          </Box>

          {/* FORM */}
          <VStack space="$3">
            {/* Linha 1 */}
            <HStack space="$6">
              <Box flex={1} mr="$3">
                <Text mb="$1">
                  CPF <Text>*</Text>
                </Text>
                <Input>
                  <InputField
                    value={cpf}
                    onChangeText={setCpf}
                    placeholder="CPF do paciente"
                  />
                </Input>
              </Box>

              <Box flex={1} mr="$3">
                <Text mb="$1">
                  Nome <Text>*</Text>
                </Text>
                <Input>
                  <InputField
                    value={nome}
                    onChangeText={setNome}
                    placeholder="Nome do paciente"
                  />
                </Input>
              </Box>

              <Box flex={1} >
                <Text mb="$1">
                  Data de nascimento <Text>*</Text>
                </Text>
                <Input>
                  <InputField
                    value={dataNascimento}
                    onChangeText={setDataNascimento}
                    placeholder="Data de nascimento"
                  />
                </Input>
              </Box>
            </HStack>

            {/* Linha 2 */}
            <HStack space="$5">
              <Box flex={1} mr="$3">
                <Text mb="$1">
                  Etnia <Text>*</Text>
                </Text>
                <Input>
                  <InputField
                    value={etnia}
                    onChangeText={setEtnia}
                    placeholder="Etnia do paciente"
                  />
                </Input>
              </Box>

              <Box flex={1} mr="$3">
                <Text mb="$1">
                  Horas de jejum <Text>*</Text>
                </Text>
                <Input>
                  <InputField
                    value={horasJejum}
                    onChangeText={setHorasJejum}
                    placeholder="Horas de jejum do paciente"
                  />
                </Input>
              </Box>

              <Box flex={1}>
                <Text mb="$1">
                  Sexo <Text>*</Text>
                </Text>
                <Input>
                  <InputField
                    value={sexo}
                    onChangeText={setSexo}
                    placeholder="Sexo do paciente"
                  />
                </Input>
              </Box>
            </HStack>

            {/* Tipo (SELECT) */}
            <Box>
              <Text mb="$1">
                Tipo <Text>*</Text>
              </Text>

              <Select
                selectedValue={tipo}
                onValueChange={setTipo}
              >
                <SelectTrigger>
                  <HStack flex={1} alignItems="center">
                    <SelectInput
                      placeholder="Selecione o tipo"
                    />
                    <SelectIcon as={MaterialIcons} name="arrow-drop-down" />
                  </HStack>
                </SelectTrigger>

                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>

                    <SelectItem label="Tipo A" value="tipoA" />
                    <SelectItem label="Tipo B" value="tipoB" />
                    <SelectItem label="Tipo C" value="tipoC" />
                  </SelectContent>
                </SelectPortal>
              </Select>
            </Box>

            {/* Observações */}
            <Box>
              <Text mb="$1">Obs.:</Text>
              <Textarea>
                <TextareaInput
                  value={obs}
                  onChangeText={setObs}
                  placeholder="Placeholder"
                  multiline
                />
              </Textarea>
            </Box>

            {/* Número de pareamento + botão + */}
            <Box>
                <Text mb="$1">
                    Número de pareamento <Text>*</Text>
                </Text>

                <HStack alignItems="center" space="$5">
                    <Input flex={1} mr="$3">
                    <InputField
                        value={numeroPareamento}
                        onChangeText={setNumeroPareamento}
                        placeholder="Placeholder"
                    />
                    </Input>

                    <Pressable
                    onPress={() => {
                        // ação de adicionar pareamento
                    }}
                    >
                    <Box
                        w={44}
                        h={44}
                        rounded="$md"
                        bg="#C75797"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Feather name="plus" size={24} color="#FFFFFF" />
                    </Box>
                    </Pressable>
                </HStack>
            </Box>

            {/* Botão Continuar centralizado */}
            <Box mt="$6" mb="$4" alignItems="center">
              <PrimaryButton w={220} onPress={handleContinue}>
                Continuar
              </PrimaryButton>
            </Box>
          </VStack>
        </Box>
      </ScrollView>
    </Box>
  );
}
