// src/screens/Home/HomeScreen.js
import { Center, Spinner, Text, View } from '@gluestack-ui/themed';
import { FlashList } from '@shopify/flash-list';
import { useEffect, useState } from 'react';
import { EventCard } from '../../components/EventCard/EventCard';
import { useAuth } from '../../context/AuthContext';

// Usa a mesma lógica de URL que você já usa no AuthContext
const API_URL = 'http://localhost:3333'
export function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [error, setError] = useState(null);

  async function fetchEvents() {
    setIsLoadingEvents(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/eventos`);
      let data = [];

      try {
        data = await response.json();
      } catch {
        data = [];
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Erro ao carregar eventos');
      }

      // back já retorna no formato:
      // [{ id, title, location, date, price, imageUrl, subscribersCount, ... }]
      setEvents(data);
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

  // Estado de loading
  if (isLoadingEvents) {
    return (
      <Center flex={1}>
        <Spinner />
        <Text mt="$2">Carregando eventos...</Text>
      </Center>
    );
  }

  // Estado de erro
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

  // Sem eventos
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
              })
            }
          />
        )}
        estimatedItemSize={140}
      />
    </View>
  );
}
