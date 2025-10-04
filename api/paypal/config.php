<?php
declare(strict_types=1);

/**
 * Configuración PayPal
 * - Rellena tus credenciales en estas constantes.
 * - Cambia PAYPAL_BASE a sandbox si quieres probar en modo prueba.
 */

// PRODUCCIÓN
define('PAYPAL_BASE', 'https://api-m.paypal.com'); // Sandbox: https://api-m.sandbox.paypal.com
define('PAYPAL_CLIENT_ID',    'AWpzB9mcg19TMlr0esrXbq2SBPoYlUWNAuoGohDk4K2wotkH6lra8FrxO-aJ8voM6suqKKsOD1ylS3LM');
define('PAYPAL_CLIENT_SECRET','EKU8K9NJJ5s_DAKgttATL2oxwk4s1_gQSRbEscjci2vYilHlNk-zLM_4FPSd1sgX8svpfUTw3I5TPBwh');

// Moneda fija de cobro (tu UI ya dice que el cobro es en USD)
define('CURRENCY_CODE', 'USD');

/** Lector de catálogo (slug -> amount USD) */
function get_product_price_usd(string $slug): ?string {
  $file = __DIR__ . '/products.json';
  if (!is_file($file)) return null;
  $json = json_decode(file_get_contents($file), true);
  if (!is_array($json)) return null;
  if (!isset($json[$slug])) return null;
  // devolver como string con 2 decimales
  return number_format((float)$json[$slug], 2, '.', '');
}

/** Obtiene access token de PayPal */
function paypal_get_access_token(): array {
  $ch = curl_init(PAYPAL_BASE . '/v1/oauth2/token');
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => ['Accept: application/json'],
    CURLOPT_POSTFIELDS     => 'grant_type=client_credentials',
    CURLOPT_USERPWD        => PAYPAL_CLIENT_ID . ':' . PAYPAL_CLIENT_SECRET,
    CURLOPT_TIMEOUT        => 25,
  ]);
  $resp = curl_exec($ch);
  $err  = curl_error($ch);
  $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  return [$code, $resp, $err];
}

/** POST JSON autenticado a PayPal */
function paypal_post(string $path, array $payload): array {
  [$tcode, $tbody, $terr] = paypal_get_access_token();
  if ($terr || $tcode < 200 || $tcode >= 300) {
    return [$tcode ?: 500, $tbody ?: json_encode(['error'=>'token_error','detail'=>$terr]), $terr];
  }
  $tok = json_decode($tbody, true)['access_token'] ?? null;
  if (!$tok) {
    return [500, json_encode(['error'=>'token_parse_error','raw'=>$tbody]), ''];
  }

  $ch = curl_init(PAYPAL_BASE . $path);
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => [
      'Content-Type: application/json',
      'Accept: application/json',
      'Authorization: Bearer ' . $tok
    ],
    CURLOPT_POSTFIELDS     => json_encode($payload),
    CURLOPT_TIMEOUT        => 25,
  ]);
  $resp = curl_exec($ch);
  $err  = curl_error($ch);
  $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  return [$code, $resp, $err];
}

/** POST vacío (captura) */
function paypal_post_empty(string $path): array {
  [$tcode, $tbody, $terr] = paypal_get_access_token();
  if ($terr || $tcode < 200 || $tcode >= 300) {
    return [$tcode ?: 500, $tbody ?: json_encode(['error'=>'token_error','detail'=>$terr]), $terr];
  }
  $tok = json_decode($tbody, true)['access_token'] ?? null;
  if (!$tok) {
    return [500, json_encode(['error'=>'token_parse_error','raw'=>$tbody]), ''];
  }

  $ch = curl_init(PAYPAL_BASE . $path);
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => [
      'Content-Type: application/json',
      'Accept: application/json',
      'Authorization: Bearer ' . $tok
    ],
    CURLOPT_POSTFIELDS     => '{}',
    CURLOPT_TIMEOUT        => 25,
  ]);
  $resp = curl_exec($ch);
  $err  = curl_error($ch);
  $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  return [$code, $resp, $err];
}
