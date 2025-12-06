// src/screens/MyEvents/MyEventsScreen.js
import {
  Box,
  Button,
  ButtonText,
  Center,
  Spinner,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import { useFocusEffect } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { useCallback, useState } from 'react';

import { EventCard } from '../../components/EventCard/EventCard';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:3333'; 
// se for device físico: http://IP_DA_MAQUINA:3333

export function MyEventsScreen({ navigation }) {
  const { user, token } = useAuth();

  const [myEvents, setMyEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchMyEvents() {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_URL}/usuarios/${user.id}/eventos-inscritos`,
        {
          headers: {
            'Content-Type': 'application/json',
            // se um dia você proteger essa rota com auth:
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      let data = [];
      try {
        data = await response.json();
      } catch {
        data = [];
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Erro ao carregar seus eventos');
      }

      // back já retorna só eventos com inscrição ativa (status = 'inscrito')
      setMyEvents(data);
    } catch (err) {
      console.log('[MyEventsScreen] erro ao buscar meus eventos:', err);
      setError(err.message || 'Erro ao carregar seus eventos');
    } finally {
      setIsLoading(false);
    }
  }

  // Recarrega sempre que a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      fetchMyEvents();
    }, [user?.id]),
  );

  if (isLoading) {
    return (
      <Center flex={1}>
        <Spinner />
        <Text mt="$2">Carregando seus eventos...</Text>
      </Center>
    );
  }

  if (error) {
    return (
      <Center flex={1} px="$4">
        <Text textAlign="center" mb="$3" color="$red600">
          {error}
        </Text>
        <Text
          color="$blue600"
          onPress={fetchMyEvents}
          style={{ textDecorationLine: 'underline' }}
        >
          Tentar novamente
        </Text>
      </Center>
    );
  }

  const hasEvents = myEvents.length > 0;

  return (
    <Box flex={1} bg="#F3F4F6" px="$3" pt="$3">
      {hasEvents ? (
        <FlashList
          data={myEvents}
          keyExtractor={(item) => String(item.id)}
          estimatedItemSize={180}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <EventCard
              date={item.date}
              title={item.title}
              location={item.location}
              price={item.price}
              subscribersCount={item.subscribersCount}
              imageUrl={item.imageUrl}
              onPress={() =>
                navigation.navigate('EventRegister', {
                  event: item,
                  fromMyEvents: true,
                })
              }
            />
          )}
        />
      ) : (
        <VStack
          flex={1}
          alignItems="center"
          justifyContent="center"
          space="md"
        >
          <Text fontSize={16} color="#4B5563">
            Você ainda não está inscrito em nenhum evento.
          </Text>

          <Button
            variant="outline"
            borderColor="#2563EB"
            onPress={() => navigation.navigate('Home')}
          >
            <ButtonText color="#2563EB">
              Ver lista de eventos
            </ButtonText>
          </Button>
        </VStack>
      )}
    </Box>
  );
}
