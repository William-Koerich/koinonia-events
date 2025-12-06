// src/components/EventCard.js
import { Box, HStack, Text, VStack } from '@gluestack-ui/themed';
import { Image, Pressable } from 'react-native';

const MONTH_LABELS = [
  'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN',
  'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ',
];

export function EventCard({
  date,
  title,
  location,
  price,
  subscribersCount,
  imageUrl,
  onPress,
  isSubscribed = false, // 👈 flag opcional
}) {
  // suporta "18/03" ou "18/03/2025"
  const [day, month] = String(date || '').split('/');
  const monthNumber = parseInt(month, 10) || 1;
  const monthLabel = MONTH_LABELS[monthNumber - 1] || month || '';
  const isFree = price?.toLowerCase?.().includes('gratuito');

  return (
    <Pressable onPress={onPress} style={{ marginBottom: 12 }}>
      <Box
        bg="#ffffff"
        borderRadius={16}
        borderWidth={1}
        borderColor="#E5E7EB"
        overflow="hidden"
        style={{
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 4 },
          elevation: 2,
        }}
      >
        {/* IMAGEM EM CIMA */}
        <Box style={{ position: 'relative' }}>
          <Image
            source={{ uri: imageUrl }}
            style={{ width: '100%', height: 140 }}
            resizeMode="cover"
          />

          {/* TAG DE DATA SOBRE A IMAGEM */}
          <Box
            px="$2"
            py="$1"
            borderRadius={8}
            bg="rgba(17, 24, 39, 0.85)"
            style={{ position: 'absolute', bottom: 10, left: 10 }}
          >
            <Text
              fontSize={14}
              color="#F9FAFB"
              style={{ fontWeight: '700' }}
            >
              {day}
            </Text>
            <Text
              fontSize={10}
              color="#E5E7EB"
              style={{ fontWeight: '600', letterSpacing: 1 }}
            >
              {monthLabel}
            </Text>
          </Box>

          {/* BADGE "INSCRITO" – só aparece se isSubscribed === true */}
          {isSubscribed && (
            <Box
              px="$2"
              py="$1"
              borderRadius={999}
              bg="rgba(22, 163, 74, 0.95)"
              style={{ position: 'absolute', top: 10, right: 10 }}
            >
              <Text
                fontSize={10}
                style={{ fontWeight: '700' }}
                color="#ECFDF3"
              >
                JÁ INSCRITO
              </Text>
            </Box>
          )}
        </Box>

        {/* CORPO DO CARD */}
        <Box px="$3" py="$3">
          <VStack space="xs">
            {/* TÍTULO */}
            <Text
              fontSize={16}
              numberOfLines={1}
              color="#111827"
              style={{ fontWeight: '600' }}
            >
              {title}
            </Text>

            {/* LOCAL */}
            <Text
              fontSize={12}
              numberOfLines={1}
              color="#6B7280"
            >
              {location}
            </Text>

            {/* LINHA: PREÇO / INSCRITOS / CTA */}
            <HStack
              mt="$2"
              alignItems="center"
              justifyContent="space-between"
            >
              <HStack space="sm" alignItems="center">
                <Text
                  fontSize={13}
                  style={{ fontWeight: '600' }}
                  color={isFree ? '#16A34A' : '#2563EB'}
                >
                  {price}
                </Text>

                <Text fontSize={11} color="#9CA3AF">
                  •
                </Text>

                <Text fontSize={11} color="#9CA3AF">
                  {subscribersCount} inscrito
                  {subscribersCount !== 1 ? 's' : ''}
                </Text>
              </HStack>

              <Text
                fontSize={11}
                style={{ fontWeight: '600' }}
                color="#6B7280"
              >
                Ver detalhes ›
              </Text>
            </HStack>
          </VStack>
        </Box>
      </Box>
    </Pressable>
  );
}
