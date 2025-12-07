// src/UpdateVersion/UpdateVersion.jsx
import {
  Box,
  Center,
  Image,
  Text,
  VStack
} from '@gluestack-ui/themed';
import { useEffect, useState } from 'react';
import LogoSplash from '../../assets/images/logo_page3.png';
import { runSplashChecks } from '../helpers/version';

export function UpdateVersion({ children }) {
  const [status, setStatus] = useState('checking'); // 'checking' | 'outdated' | 'error' | 'ok'
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      validateVersionAndUpdates();
    }, 1000); // pequeno delay só pra dar tempo da view montar

    return () => clearTimeout(timer);
  }, []);

  const validateVersionAndUpdates = async () => {
    try {
      const result = await runSplashChecks();
      setDetails(result);

      // Versão abaixo da mínima -> bloqueia e mostra mensagem
      if (!result.ok && result.reason === 'OUTDATED') {
        setStatus('outdated');
        return;
      }

      // Erro ao checar update (caso clássico do Expo Go)
      if (!result.ok && result.reason === 'UPDATE_ERROR') {
        console.log('[UpdateVersion] erro ao checar updates, seguindo assim mesmo');
        setStatus('ok');
        return;
      }

      // Tudo ok
      setStatus('ok');
    } catch (error) {
      console.log('[UpdateVersion] erro geral na validação:', error);
      setStatus('error');
    }
  };

  // ---- UI de validação ----

  if (status === 'checking') {
    return (
      <VStack flex={1} justifyContent="center" alignItems="center" bg="$white">
        <Image
          source={LogoSplash}
          alt="Splash Image"
          resizeMode="contain"
          w="50%"       // metade da largura da tela
          h={undefined}
          // se quiser, pode tirar o aspectRatio; ele já respeita o da imagem
        />

        <Center w="100%" mt="$6">
          <Box w="90%" maxWidth={400} alignItems="center" justifyContent="center">
             <Image
                source={LogoSplash}
                resizeMode="contain"
                style={{
                    width: '50%',  // metade da largura disponível
                    height: undefined,
                    aspectRatio: 1 / 1, // ou outra proporção que se aproxime
                }}
            />
            <Text mt="$2" textAlign="center">
              Validando a versão do aplicativo...
            </Text>
          </Box>
        </Center>
      </VStack>
    );
  }

  if (status === 'outdated') {
    const current = details?.versionResult?.currentVersion || 'desconhecida';
    const min = details?.versionResult?.minVersion || 'desconhecida';

    return (
      <VStack flex={1} justifyContent="center" alignItems="center" bg="$white" px="$4">
        <Image
          source={LogoSplash}
          alt="Splash Image"
          resizeMode="contain"
          w="50%"
          h={undefined}
          mb="$6"
        />

        <Box maxWidth={400} alignItems="center">
          <Text fontSize="$xl" fontWeight="$bold" textAlign="center" mb="$2">
            Atualização necessária
          </Text>

          <Text textAlign="center" mb="$2">
            Sua versão do aplicativo está desatualizada e não é mais suportada.
          </Text>

          <Text textAlign="center" mb="$1">
            Versão atual instalada:{' '}
            <Text fontWeight="$bold">{current}</Text>
          </Text>

          <Text textAlign="center" mb="$4">
            Versão mínima exigida:{' '}
            <Text fontWeight="$bold">{min}</Text>
          </Text>

          {/* Aqui depois você adiciona um botão pra abrir App Store / Play Store */}
        </Box>
      </VStack>
    );
  }

  if (status === 'error') {
    return (
      <VStack flex={1} justifyContent="center" alignItems="center" bg="$white" px="$4">
        <Image
          source={LogoSplash}
          alt="Splash Image"
          resizeMode="contain"
          w="50%"
          h={undefined}
          mb="$6"
        />

        <Box maxWidth={400} alignItems="center">
          <Text fontSize="$xl" fontWeight="$bold" textAlign="center" mb="$2">
            Erro ao iniciar
          </Text>
          <Text textAlign="center">
            Ocorreu um erro ao validar a versão ou verificar atualizações.
            Verifique sua conexão e tente novamente.
          </Text>
        </Box>
      </VStack>
    );
  }

  // status === 'ok' -> libera o app
  return children;
}
