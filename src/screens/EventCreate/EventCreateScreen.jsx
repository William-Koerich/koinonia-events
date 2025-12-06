// src/screens/EventCreate/EventCreateScreen.js
import {
  Box,
  Button,
  ButtonText,
  Divider,
  HStack,
  Input,
  InputField,
  Text,
  Textarea,
  TextareaInput,
  VStack,
} from '@gluestack-ui/themed';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Image, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:3333'

export function EventCreateScreen({ navigation }) {
  const { user, token } = useAuth();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');           // ex: 18/03/2025
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');         // ex: R$ 150,00 ou Gratuito
  const [imageUri, setImageUri] = useState('');
  const [description, setDescription] = useState('');
  const [attractions, setAttractions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handlePickImage() {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Precisamos de acesso à galeria para escolher a imagem do evento.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  }

  async function handleSubmit() {
    if (!token) {
      Alert.alert(
        'Sessão expirada',
        'Faça login novamente para criar eventos.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title,
        date,
        location,
        price: price || 'Gratuito',
        imageUrl: imageUri,
        description,
        attractions,
        criadoPorId: user?.id ?? null,
      };

      console.log('[EventCreateScreen] enviando payload:', payload);

      const response = await fetch(`${API_URL}/eventos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log('[EventCreateScreen] resposta criação:', response.status, data);

      if (!response.ok) {
        throw new Error(data?.error || 'Erro ao criar evento');
      }

      Alert.alert(
        'Evento criado',
        'Evento criado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => {
              if (navigation && navigation.goBack) {
                navigation.goBack();
              }
            },
          },
        ],
      );

      // opcional: limpar formulário
      setTitle('');
      setDate('');
      setLocation('');
      setPrice('');
      setImageUri('');
      setDescription('');
      setAttractions('');
    } catch (err) {
      console.log('[EventCreateScreen] erro ao criar evento:', err);
      Alert.alert('Erro', err.message || 'Erro ao criar evento');
    } finally {
      setIsSubmitting(false);
    }
  }

  const isSubmitDisabled =
    !title.trim() ||
    !date.trim() ||
    !location.trim() ||
    !imageUri.trim() ||
    isSubmitting;

  return (
    <Box flex={1} bg="#F3F4F6">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
        <VStack mb="$3" space="xs">
          <Text
            fontSize={20}
            color="#111827"
            style={{ fontWeight: '600' }}
          >
            Novo evento
          </Text>
          <Text fontSize={13} color="#6B7280">
            Preencha as informações abaixo para cadastrar um novo evento.
          </Text>
        </VStack>

        {/* CARD DO FORMULÁRIO */}
        <Box
          bg="#ffffff"
          borderRadius={16}
          p="$4"
          borderWidth={1}
          borderColor="#E5E7EB"
          style={{
            shadowColor: '#000',
            shadowOpacity: 0.04,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 2,
          }}
        >
          <VStack space="md">
            {/* Informações básicas */}
            <VStack space="xs">
              <Text
                fontSize={14}
                color="#111827"
                style={{ fontWeight: '600' }}
              >
                Informações básicas
              </Text>
              <Text fontSize={12} color="#6B7280">
                Esses dados aparecem na lista de eventos e no detalhe.
              </Text>
            </VStack>

            {/* Título */}
            <VStack space="xs">
              <Text fontSize={12} color="#6B7280">
                Título do evento
              </Text>
              <Input bg="#FFFFFF" borderColor="#E5E7EB">
                <InputField
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Ex: Conferência de Tecnologia"
                  placeholderTextColor="#9CA3AF"
                  style={{ color: '#111827', fontSize: 14 }}
                />
              </Input>
            </VStack>

            {/* Data & Local */}
            <HStack space="md">
              <VStack flex={1} space="xs">
                <Text fontSize={12} color="#6B7280">
                  Data
                </Text>
                <Input bg="#FFFFFF" borderColor="#E5E7EB">
                  <InputField
                    value={date}
                    onChangeText={setDate}
                    placeholder="18/03/2025"
                    placeholderTextColor="#9CA3AF"
                    style={{ color: '#111827', fontSize: 14 }}
                  />
                </Input>
              </VStack>

              <VStack flex={1} space="xs">
                <Text fontSize={12} color="#6B7280">
                  Local
                </Text>
                <Input bg="#FFFFFF" borderColor="#E5E7EB">
                  <InputField
                    value={location}
                    onChangeText={setLocation}
                    placeholder="Ex: Igreja Koinonia ou Online"
                    placeholderTextColor="#9CA3AF"
                    style={{ color: '#111827', fontSize: 14 }}
                  />
                </Input>
              </VStack>
            </HStack>

            {/* Preço */}
            <VStack space="xs">
              <Text fontSize={12} color="#6B7280">
                Preço
              </Text>
              <Input bg="#FFFFFF" borderColor="#E5E7EB">
                <InputField
                  value={price}
                  onChangeText={setPrice}
                  placeholder='Ex: R$ 150,00 ou "Gratuito"'
                  placeholderTextColor="#9CA3AF"
                  style={{ color: '#111827', fontSize: 14 }}
                />
              </Input>
              <Text fontSize={11} color="#9CA3AF">
                Se deixar vazio, o evento será considerado como Gratuito.
              </Text>
            </VStack>

            <Divider bg="#E5E7EB" />

            {/* Imagem do evento */}
            <VStack space="xs">
              <Text
                fontSize={14}
                color="#111827"
                style={{ fontWeight: '600' }}
              >
                Imagem do evento
              </Text>
              <Text fontSize={12} color="#6B7280">
                Selecione uma imagem da galeria para representar o evento.
              </Text>
            </VStack>

            {/* Preview + botão */}
            <VStack space="md">
              <Box
                bg="#F9FAFB"
                borderRadius={12}
                borderWidth={1}
                borderColor="#E5E7EB"
                justifyContent="center"
                alignItems="center"
                style={{ height: 160, overflow: 'hidden' }}
              >
                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                ) : (
                  <Text fontSize={12} color="#9CA3AF">
                    Nenhuma imagem selecionada
                  </Text>
                )}
              </Box>

              <Button
                variant="outline"
                borderColor="#3B82F6"
                onPress={handlePickImage}
              >
                <ButtonText color="#2563EB">
                  Escolher imagem da galeria
                </ButtonText>
              </Button>
            </VStack>

            <Divider bg="#E5E7EB" />

            {/* Detalhes do evento */}
            <VStack space="xs">
              <Text
                fontSize={14}
                color="#111827"
                style={{ fontWeight: '600' }}
              >
                Detalhes do evento
              </Text>
            </VStack>

            {/* Descrição - TEXTAREA */}
            <VStack space="xs">
              <Text fontSize={12} color="#6B7280">
                Descrição
              </Text>
              <Textarea bg="#FFFFFF" borderColor="#E5E7EB">
                <TextareaInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Fale um pouco sobre o propósito e o conteúdo do evento."
                  placeholderTextColor="#9CA3AF"
                  style={{ color: '#111827', fontSize: 14 }}
                  textAlignVertical="top"
                  multiline
                />
              </Textarea>
            </VStack>

            {/* Atrações - TEXTAREA */}
            <VStack space="xs">
              <Text fontSize={12} color="#6B7280">
                Atrações
              </Text>
              <Textarea bg="#FFFFFF" borderColor="#E5E7EB">
                <TextareaInput
                  value={attractions}
                  onChangeText={setAttractions}
                  placeholder="Ex: Banda de louvor, palestrante convidado, oficinas..."
                  placeholderTextColor="#9CA3AF"
                  style={{ color: '#111827', fontSize: 14 }}
                  textAlignVertical="top"
                  multiline
                />
              </Textarea>
            </VStack>
          </VStack>
        </Box>

        {/* BOTÃO SALVAR */}
        <Box mt="$4">
          <Button
            size="lg"
            onPress={handleSubmit}
            isDisabled={isSubmitDisabled}
            opacity={isSubmitDisabled ? 0.6 : 1}
          >
            <ButtonText style={{ fontWeight: '600' }}>
              {isSubmitting ? 'Salvando...' : 'Salvar evento'}
            </ButtonText>
          </Button>
        </Box>
      </ScrollView>
    </Box>
  );
}
