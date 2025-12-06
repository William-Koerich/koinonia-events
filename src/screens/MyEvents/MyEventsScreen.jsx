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
import { FlashList } from '@shopify/flash-list';
import { useCallback, useEffect, useState } from 'react';

import { EventCard } from '../../components/EventCard/EventCard';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:3333'

export function MyEventsScreen({ navigation }) {
  const { user, token } = useAuth();

  const [myEvents, setMyEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const hasEvents = myEvents.length > 0;

  const fetchMyEvents = useCallback(async () => {
    if (!user || !token) return;

    setError(null);
    setIsLoading(true);

    try {
      // 👇 ajuste a rota se no back estiver diferente
      const response = await fetch(
        `${API_URL}/usuarios/${user.id}/eventos-inscritos`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
        throw new Error(data?.error || 'Erro ao carregar seus eventos.');
      }

      // Se o back já devolve no formato certo, é só setar:
      setMyEvents(data || []);
    } catch (err) {
      console.log('[MyEventsScreen] erro ao buscar eventos do usuário:', err);
      setError(err.message || 'Erro ao carregar seus eventos.');
    } finally {
      setIsLoading(false);
    }
  }, [user, token]);

  // Carrega ao montar a tela
  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

  async function handleRefresh() {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await fetchMyEvents();
    } finally {
      setIsRefreshing(false);
    }
  }

  // Estado de carregando inicial
  if (isLoading && !isRefreshing && myEvents.length === 0) {
    return (
      <Center flex={1} bg="#F3F4F6">
        <Spinner size="large" />
        <Text mt="$3" color="#4B5563">
          Carregando seus eventos...
        </Text>
      </Center>
    );
  }

  return (
    <Box flex={1} bg="#F3F4F6" px="$3" pt="$3">
      {error && (
        <Box mb="$3" px="$3" py="$2" bg="#FEE2E2" borderRadius={12}>
          <Text color="#B91C1C" fontSize={13}>
            {error}
          </Text>
        </Box>
      )}

      {hasEvents ? (
        <FlashList
          data={myEvents}
          keyExtractor={(item) => String(item.id)}
          estimatedItemSize={180}
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
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
          <Text fontSize={16} color="#4B5563" textAlign="center">
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
