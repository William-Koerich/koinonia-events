// src/screens/Home/HomeScreen.js
import { Center, Spinner, Text, View } from '@gluestack-ui/themed';
import { FlashList } from '@shopify/flash-list';
import { useEffect, useState } from 'react';
import { EventCard } from '../../components/EventCard/EventCard';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:3333';

export function HomeScreen({ navigation }) {
  const { user, token } = useAuth();

  const [events, setEvents] = useState([]);
  const [subscribedEventIds, setSubscribedEventIds] = useState(new Set());
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [error, setError] = useState(null);

  async function fetchEvents() {
    setIsLoadingEvents(true);
    setError(null);

    try {
      // 1) busca todos os eventos
      const [eventsRes, myEventsRes] = await Promise.all([
        fetch(`${API_URL}/eventos`),
        user
          ? fetch(`${API_URL}/usuarios/${user.id}/eventos-inscritos`, {
              headers: token
                ? { Authorization: `Bearer ${token}` }
                : undefined,
            })
          : Promise.resolve(null),
      ]);

      // --- eventos gerais ---
      let eventsData = [];
      try {
        eventsData = await eventsRes.json();
      } catch {
        eventsData = [];
      }

      if (!eventsRes.ok) {
        throw new Error(eventsData?.error || 'Erro ao carregar eventos');
      }

      setEvents(eventsData);

      // --- meus eventos (inscrições) ---
      if (myEventsRes) {
        let myEventsData = [];
        try {
          myEventsData = await myEventsRes.json();
        } catch {
          myEventsData = [];
        }

        if (myEventsRes.ok && Array.isArray(myEventsData)) {
          const ids = new Set(
            myEventsData.map((ev) => String(ev.id)),
          );
          setSubscribedEventIds(ids);
        }
      }
    } catch (err) {
      console.log('[HomeScreen] erro ao buscar eventos:', err);
      setError(err.message || 'Erro ao carregar eventos');
    } finally {
      setIsLoadingEvents(false);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  if (isLoadingEvents) {
    return (
      <Center flex={1}>
        <Spinner />
        <Text mt="$2">Carregando eventos...</Text>
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
          onPress={fetchEvents}
          style={{ textDecorationLine: 'underline' }}
        >
          Tentar novamente
        </Text>
      </Center>
    );
  }

  if (!events.length) {
    return (
      <Center flex={1} px="$4">
        <Text textAlign="center" color="$coolGray600">
          Nenhum evento disponível no momento.
        </Text>
      </Center>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlashList
        data={events}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const isSubscribed = subscribedEventIds.has(String(item.id));

          return (
            <EventCard
              date={item.date}
              title={item.title}
              location={item.location}
              price={item.price}
              subscribersCount={item.subscribersCount}
              imageUrl={item.imageUrl}
              isSubscribed={isSubscribed} // 👈 usa no card
              onPress={() =>
                navigation.navigate('EventRegister', {
                  event: item,
                  isSubscribed, // 👈 passa pro detalhe também
                })
              }
            />
          );
        }}
        estimatedItemSize={140}
      />
    </View>
  );
}
