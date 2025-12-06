// src/helpers/version.js
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';

const MIN_SUPPORTED_VERSION = '1.0.0'; // define aqui a versão mínima

function parseVersion(version) {
  return version.split('.').map((n) => Number(n) || 0);
}

function isVersionGreaterOrEqual(a, b) {
  const pa = parseVersion(a);
  const pb = parseVersion(b);

  for (let i = 0; i < 3; i += 1) {
    const va = pa[i] ?? 0;
    const vb = pb[i] ?? 0;

    if (va > vb) return true;
    if (va < vb) return false;
  }
  return true;
}

async function checkAppVersion() {
  const expoConfig = Constants.expoConfig || {};
  const currentVersion =
    expoConfig.version ||
    (Constants.manifest2 &&
      Constants.manifest2.extra &&
      Constants.manifest2.extra.version) ||
    '0.0.0';

  const ok = isVersionGreaterOrEqual(currentVersion, MIN_SUPPORTED_VERSION);

  // 👇 NÃO tem Alert aqui. Só retornamos os dados.
  return {
    ok,
    currentVersion,
    minVersion: MIN_SUPPORTED_VERSION,
  };
}

async function checkExpoUpdate() {
  try {
    const update = await Updates.checkForUpdateAsync();

    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }

    return {
      ok: true,
      isAvailable: update.isAvailable,
    };
  } catch (error) {
    console.log('[Updates] erro ao verificar atualização:', error);
    return {
      ok: false,
      error,
    };
  }
}

// Essa função é a que a sua SplashScreen está usando
export async function runSplashChecks() {
  const versionResult = await checkAppVersion();

  if (!versionResult.ok) {
    // 👇 avisamos para a SplashScreen que a versão é inválida
    return {
      ok: false,
      reason: 'OUTDATED',
      versionResult,
    };
  }

  const updateResult = await checkExpoUpdate();

  if (!updateResult.ok) {
    return {
      ok: false,
      reason: 'UPDATE_ERROR',
      versionResult,
      updateResult,
    };
  }

  return {
    ok: true,
    reason: 'OK',
    versionResult,
    updateResult,
  };
}
