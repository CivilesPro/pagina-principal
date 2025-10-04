<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

$base = 'https://plantilladecantidades.onrender.com';
$paths = [
  '/api/paypal/create-order',
  '/api/paypal/create-order/',
  '/api/paypal/capture-order',
  '/api/paypal/capture-order/',
];

function call(string $method, string $url, ?string $body = null): array {
  $ch = curl_init($url);
  $headers = ['Accept: application/json'];
  if ($method === 'POST') {
    $headers[] = 'Content-Type: application/json';
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $body ?? '{}');
  } else {
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
  }
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 20,
    CURLOPT_HEADER         => true,
  ]);
  $raw        = curl_exec($ch);
  $err        = curl_error($ch);
  $code       = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
  $headerSize = (int) curl_getinfo($ch, CURLINFO_HEADER_SIZE);
  $respHeaders = $headerSize > 0 ? substr($raw, 0, $headerSize) : '';
  $respBody    = $headerSize > 0 ? substr($raw, $headerSize) : ($raw ?: '');
  curl_close($ch);
  return compact('method', 'url', 'code', 'respHeaders', 'respBody', 'err');
}

$out = [];
foreach ($paths as $p) {
  $out[] = call('OPTIONS', $base . $p);
  $out[] = call('POST', $base . $p, json_encode(['slug' => 'test', 'currency' => 'COP']));
}

echo json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
