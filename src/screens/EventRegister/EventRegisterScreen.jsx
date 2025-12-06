// src/screens/EventRegister/EventRegisterScreen.js
import {
  Box,
  Button,
  ButtonText,
  Divider,
  HStack,
  Input,
  InputField,
  Spinner,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:3333';

export function EventRegisterScreen({ route, navigation }) {
  const { event, fromMyEvents, isSubscribed: isSubscribedFromHome } =
    route.params || {};

  const isMyEvent = !!fromMyEvents;
  const alreadySubscribed = !!isSubscribedFromHome || !!fromMyEvents;

  const { user, token } = useAuth();

  const currentEvent = event || {
    id: '1',
    title: 'Conferência de Tecnologia',
    date: '18/03/2025',
    location: 'São Paulo - SP',
    price: 'R$ 150,00',
    subscribersCount: 32,
    imageUrl:
      'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg',
    description:
      'Uma conferência com foco em inovação, desenvolvimento de software e boas práticas na indústria de tecnologia.',
    attractions: 'Palestrante X, Painel Y, Workshop Z',
  };

  const [people, setPeople] = useState([{ id: 1, name: '', age: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isLoadingMyParticipants, setIsLoadingMyParticipants] = useState(false);

  function handleChangePerson(index, field, value) {
    const updated = [...people];
    updated[index] = { ...updated[index], [field]: value };
    setPeople(updated);
  }

  function handleAddPerson() {
    setPeople(prev => [...prev, { id: prev.length + 1, name: '', age: '' }]);
  }

  function handleRemovePerson(id) {
    setPeople(prev => prev.filter(p => p.id !== id));
  }

  // 🔎 Busca participantes já inscritos para ESTE evento + usuário logado
  useEffect(() => {
    if (!user || !token || !alreadySubscribed) return;

    async function fetchMyParticipants() {
      try {
        setIsLoadingMyParticipants(true);

        const response = await fetch(
          `${API_URL}/eventos/${currentEvent.id}/inscricoes/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.status === 404) {
          // não tem inscrição registrada
          return;
        }

        let data = {};
        try {
          data = await response.json();
        } catch {
          data = {};
        }

        if (!response.ok) {
          throw new Error(data?.error || 'Erro ao buscar inscrição');
        }

        // espera algo como { participantes: [ { nome, idade }, ... ] }
        if (Array.isArray(data.participantes) && data.participantes.length) {
          const mapped = data.participantes.map((p, index) => ({
            id: index + 1,
            name: p.nome,
            age: p.idade != null ? String(p.idade) : '',
          }));
          setPeople(mapped);
        }
      } catch (err) {
        console.log(
          '[EventRegisterScreen] erro ao buscar participantes inscritos:',
          err,
        );
      } finally {
        setIsLoadingMyParticipants(false);
      }
    }

    fetchMyParticipants();
  }, [user, token, currentEvent.id, alreadySubscribed]);

  // 👉 Criar / atualizar inscrição (pode ser usado tanto primeira vez quanto depois)
  async function handleSubmit() {
    if (!token || !user) {
      Alert.alert(
        'Sessão expirada',
        'Faça login novamente para se inscrever no evento.',
      );
      return;
    }

    const participantesValidos = people
      .filter(p => p.name && p.name.trim())
      .map(p => ({
        nome: p.name.trim(),
        idade: p.age ? Number(p.age) : null,
      }));

    if (!participantesValidos.length) {
      Alert.alert(
        'Dados incompletos',
        'Informe pelo menos o nome de um participante.',
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        usuarioId: user.id,
        participantes: participantesValidos,
      };

      console.log('[EventRegisterScreen] enviando inscrição:', payload);

      const response = await fetch(
        `${API_URL}/eventos/${currentEvent.id}/inscricoes`,
        {
          method: 'POST', // o back trata como "criar ou atualizar"
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log(
        '[EventRegisterScreen] resposta inscrição:',
        response.status,
        data,
      );

      if (!response.ok) {
        throw new Error(data?.error || 'Erro ao salvar inscrição');
      }

      Alert.alert(
        alreadySubscribed ? 'Inscrição atualizada' : 'Inscrição realizada',
        alreadySubscribed
          ? 'Sua inscrição foi atualizada com sucesso!'
          : 'Sua inscrição foi registrada com sucesso!',
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
    } catch (err) {
      console.log('[EventRegisterScreen] erro ao inscrever:', err);
      Alert.alert('Erro', err.message || 'Erro ao salvar inscrição');
    } finally {
      setIsSubmitting(false);
    }
  }

  // 👉 Cancelar inscrição (usado principalmente em Meus Eventos)
  async function handleCancelSubscription() {
    if (!token || !user) {
      Alert.alert(
        'Sessão expirada',
        'Faça login novamente para cancelar sua inscrição.',
      );
      return;
    }

    try {
      setIsCanceling(true);

      const response = await fetch(
        `${API_URL}/eventos/${currentEvent.id}/inscricoes/${user.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log(
        '[EventRegisterScreen] resposta cancelamento:',
        response.status,
        data,
      );

      if (!response.ok) {
        throw new Error(data?.error || 'Erro ao cancelar inscrição');
      }

      Alert.alert(
        'Inscrição cancelada',
        'Sua inscrição neste evento foi cancelada.',
        [
          {
            text: 'OK',
            onPress: () => navigation?.goBack && navigation.goBack(),
          },
        ],
      );
    } catch (err) {
      console.log('[EventRegisterScreen] erro ao cancelar inscrição:', err);
      Alert.alert('Erro', err.message || 'Erro ao cancelar inscrição');
    } finally {
      setIsCanceling(false);
    }
  }

  const isConfirmDisabled =
    isSubmitting ||
    !people.some(p => p.name && p.name.trim());

  const confirmButtonLabel = alreadySubscribed
    ? 'Atualizar inscrição'
    : 'Confirmar inscrição';

  return (
    <Box flex={1} bg="#F3F4F6">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        {/* HERO DO EVENTO */}
        <Box
          bg="#ffffff"
          borderRadius={16}
          overflow="hidden"
          style={{
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            elevation: 3,
          }}
        >
          <Box style={{ position: 'relative' }}>
            <Image
              source={{ uri: currentEvent.imageUrl }}
              style={{ width: '100%', height: 200 }}
              resizeMode="cover"
            />

            {/* badge de data */}
            <Box
              px="$3"
              py="$2"
              borderRadius={12}
              bg="rgba(17,24,39,0.85)"
              style={{ position: 'absolute', bottom: 12, left: 12 }}
            >
              <Text
                color="#F9FAFB"
                style={{ fontWeight: '700' }}
                fontSize={14}
              >
                {currentEvent.date}
              </Text>
            </Box>
          </Box>

          {/* informações principais */}
          <Box px="$4" py="$3">
            <VStack space="xs">
              <Text
                fontSize={20}
                color="#111827"
                style={{ fontWeight: '600' }}
              >
                {currentEvent.title}
              </Text>

              <Text fontSize={13} color="#6B7280">
                {currentEvent.location}
              </Text>

              <HStack
                mt="$2"
                alignItems="center"
                flexWrap="wrap"
                space="md"
              >
                <Box
                  px="$2"
                  py="$1"
                  borderRadius={999}
                  bg="#EEF2FF"
                >
                  <Text
                    fontSize={12}
                    color="#4F46E5"
                    style={{ fontWeight: '600' }}
                  >
                    {currentEvent.date}
                  </Text>
                </Box>

                <Text
                  fontSize={14}
                  color="#16A34A"
                  style={{ fontWeight: '600' }}
                >
                  {currentEvent.price}
                </Text>

                <Text fontSize={12} color="#9CA3AF">
                  · {currentEvent.subscribersCount} inscrito
                  {currentEvent.subscribersCount !== 1 ? 's' : ''}
                </Text>
              </HStack>
            </VStack>
          </Box>
        </Box>

        {/* SOBRE O EVENTO */}
        <Box mt="$4" bg="#ffffff" borderRadius={16} p="$4">
          <VStack space="md">
            <VStack space="xs">
              <Text
                fontSize={14}
                color="#111827"
                style={{ fontWeight: '600' }}
              >
                Sobre o evento
              </Text>
              <Text fontSize={13} color="#6B7280">
                {currentEvent.description}
              </Text>
            </VStack>

            <Divider bg="#E5E7EB" />

            <VStack space="xs">
              <Text
                fontSize={14}
                color="#111827"
                style={{ fontWeight: '600' }}
              >
                Atrações
              </Text>
              <Text fontSize={13} color="#6B7280">
                {currentEvent.attractions}
              </Text>
            </VStack>
          </VStack>
        </Box>

        {/* AVISO DE JÁ INSCRITO */}
        {alreadySubscribed && (
          <Box mt="$4" bg="#ECFDF3" borderRadius={16} p="$3" borderWidth={1} borderColor="#BBF7D0">
            <Text
              fontSize={13}
              color="#15803D"
              style={{ fontWeight: '600' }}
            >
              Você já está inscrito neste evento.
            </Text>
            <Text fontSize={12} color="#166534" mt="$1">
              Os participantes abaixo são da sua inscrição atual. 
              Você pode editar, remover ou adicionar novos participantes e depois clicar em "{confirmButtonLabel}".
            </Text>
          </Box>
        )}

        {/* FORMULÁRIO DE INSCRIÇÃO / EDIÇÃO */}
        <Box mt="$4">
          <Text
            fontSize={16}
            color="#111827"
            style={{ fontWeight: '600' }}
          >
            {alreadySubscribed
              ? 'Editar participantes da sua inscrição'
              : 'Inscrição dos participantes'}
          </Text>

          {!alreadySubscribed && (
            <Text
              fontSize={12}
              color="#6B7280"
              mt="$1"
            >
              Você pode se inscrever e também adicionar familiares ou amigos
              que não têm conta no app.
            </Text>
          )}

          <Box
            mt="$3"
            bg="#ffffff"
            borderRadius={16}
            p="$3"
            borderWidth={1}
            borderColor="#E5E7EB"
          >
            {isLoadingMyParticipants ? (
              <HStack alignItems="center" space="sm">
                <Spinner />
                <Text fontSize={12} color="#6B7280">
                  Carregando participantes...
                </Text>
              </HStack>
            ) : (
              <VStack space="md">
                {people.map((person, index) => (
                  <Box
                    key={person.id}
                    p="$3"
                    borderRadius={12}
                    bg="#F9FAFB"
                    borderWidth={1}
                    borderColor="#E5E7EB"
                    mt={index > 0 ? '$2' : 0}
                  >
                    <HStack
                      justifyContent="space-between"
                      mb="$2"
                      alignItems="center"
                    >
                      <Text
                        fontSize={13}
                        color="#4B5563"
                        style={{ fontWeight: '600' }}
                      >
                        Participante {index + 1}
                      </Text>

                      {index > 0 && (
                        <Text
                          fontSize={11}
                          color="#DC2626"
                          onPress={() => handleRemovePerson(person.id)}
                          style={{ fontWeight: '600' }}
                        >
                          Remover
                        </Text>
                      )}
                    </HStack>

                    {/* Nome */}
                    <VStack space="xs" mb="$3">
                      <Text fontSize={12} color="#6B7280">
                        Nome completo
                      </Text>
                      <Input bg="#FFFFFF" borderColor="#E5E7EB">
                        <InputField
                          value={person.name}
                          onChangeText={text =>
                            handleChangePerson(index, 'name', text)
                          }
                          placeholder="Digite o nome"
                          placeholderTextColor="#9CA3AF"
                          style={{
                            color: '#111827',
                            fontSize: 14,
                          }}
                        />
                      </Input>
                    </VStack>

                    {/* Idade */}
                    <VStack space="xs">
                      <Text fontSize={12} color="#6B7280">
                        Idade
                      </Text>
                      <Input bg="#FFFFFF" borderColor="#E5E7EB">
                        <InputField
                          value={person.age}
                          onChangeText={text =>
                            handleChangePerson(index, 'age', text)
                          }
                          placeholder="Ex: 12"
                          placeholderTextColor="#9CA3AF"
                          keyboardType="numeric"
                          style={{
                            color: '#111827',
                            fontSize: 14,
                          }}
                        />
                      </Input>
                    </VStack>
                  </Box>
                ))}

                {/* Botão para adicionar pessoa dentro do card */}
                <Button
                  variant="outline"
                  borderColor="#3B82F6"
                  onPress={handleAddPerson}
                >
                  <ButtonText color="#2563EB">
                    Adicionar participante
                  </ButtonText>
                </Button>
              </VStack>
            )}
          </Box>
        </Box>

        {/* BOTÃO PRINCIPAL (criar/atualizar inscrição) */}
        <Box mt="$4">
          <Button
            size="lg"
            onPress={handleSubmit}
            isDisabled={isConfirmDisabled}
            opacity={isConfirmDisabled ? 0.6 : 1}
          >
            {isSubmitting ? (
              <HStack alignItems="center" space="sm">
                <Spinner color="$white" />
                <ButtonText style={{ fontWeight: '600' }}>
                  {alreadySubscribed ? 'Atualizando...' : 'Enviando...'}
                </ButtonText>
              </HStack>
            ) : (
              <ButtonText style={{ fontWeight: '600' }}>
                {confirmButtonLabel}
              </ButtonText>
            )}
          </Button>
        </Box>

        {/* MODO "MEUS EVENTOS" → botão de cancelar inscrição */}
        {isMyEvent && (
          <Box mt="$4">
            <Button
              size="lg"
              variant="outline"
              borderColor="#DC2626"
              onPress={handleCancelSubscription}
              isDisabled={isCanceling}
              opacity={isCanceling ? 0.6 : 1}
            >
              {isCanceling ? (
                <HStack alignItems="center" space="sm">
                  <Spinner color="#DC2626" />
                  <ButtonText
                    style={{ fontWeight: '600', color: '#DC2626' }}
                  >
                    Cancelando...
                  </ButtonText>
                </HStack>
              ) : (
                <ButtonText
                  style={{ fontWeight: '600', color: '#DC2626' }}
                >
                  Cancelar inscrição
                </ButtonText>
              )}
            </Button>
          </Box>
        )}
      </ScrollView>
    </Box>
  );
}
