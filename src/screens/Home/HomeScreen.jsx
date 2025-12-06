import { View } from '@gluestack-ui/themed';
import { FlashList } from '@shopify/flash-list';
import { EventCard } from '../../components/EventCard/EventCard';
import { useAuth } from '../../context/AuthContext';

export function HomeScreen({ navigation }) {
  const { user, signOut } = useAuth();

  const events = [
  {
    id: '1',
    date: '18/03/2025',
    title: 'Conferência de Tecnologia',
    location: 'Igreja Koinonia',
    price: 'R$ 150,00',
    subscribersCount: 32,
    imageUrl:
      'https://images.pexels.com/photos/3184160/pexels-photo-3184160.jpeg',
    description:
      'Um dia inteiro de palestras e atividades voltadas para tecnologia, inovação e desenvolvimento de software com foco no ministério e na igreja.',
    attractions:
      'Palestras com especialistas em TI, momentos de networking, painéis de discussão e espaço para perguntas e respostas.',
  },
  {
    id: '2',
    date: '20/03/2025',
    title: 'Workshop de React Native',
    location: 'Online',
    price: 'Gratuito',
    subscribersCount: 120,
    imageUrl:
      'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
    description:
      'Workshop prático de React Native para quem quer aprender a criar aplicativos do zero, com foco em projetos para a igreja.',
    attractions:
      'Aulas ao vivo, demonstração prática de código, material de apoio e sessão de dúvidas ao final.',
  },
];

  const rootNavigation = navigation.getParent(); // Stack do RootNavigator

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlashList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard
            date={item.date}
            title={item.title}
            location={item.location}
            price={item.price}
            subscribersCount={item.subscribersCount}
            imageUrl={item.imageUrl}
            onPress={() => navigation.navigate('EventRegister', { event: item })}
          />
        )}
        estimatedItemSize={100}
      />
    </View>
  );

}