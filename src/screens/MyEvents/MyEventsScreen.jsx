// src/screens/MyEvents/MyEventsScreen.js
import {
    Box,
    Button,
    ButtonText,
    Text,
    VStack,
} from '@gluestack-ui/themed';
import { FlashList } from '@shopify/flash-list';

import { EventCard } from '../../components/EventCard/EventCard'; // ajusta o caminho se for diferente
import { useAuth } from '../../context/AuthContext';

export function MyEventsScreen({ navigation }) {
  const { user } = useAuth();

  // 🔧 MOCK por enquanto – depois você troca por chamada de API / contexto
  const myEvents = [
    {
      id: '1',
      date: '18/03/2025',
      title: 'Conferência de Tecnologia',
      location: 'Igreja Koinonia',
      price: 'R$ 150,00',
      subscribersCount: 32,
      imageUrl: 'https://images.pexels.com/photos/3184160/pexels-photo-3184160.jpeg',
      description:
        'Um dia inteiro de palestras e atividades voltadas para tecnologia, inovação e desenvolvimento de software com foco no ministério e na igreja.',
      attractions:
        'Palestras com especialistas em TI, momentos de networking, painéis de discussão e espaço para perguntas e respostas.',
    },
    // aqui ficariam só os eventos em que o usuário (user) está inscrito
  ];

  const hasEvents = myEvents.length > 0;

  return (
    <Box flex={1} bg="#F3F4F6" px="$3" pt="$3">
      {hasEvents ? (
        <FlashList
          data={myEvents}
          keyExtractor={(item) => item.id}
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
                navigation.navigate('EventRegister', { event: item, fromMyEvents: true })
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
            onPress={() => navigation.navigate('Home')} // ou o nome da rota da lista principal
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
