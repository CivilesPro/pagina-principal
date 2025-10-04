<?php
declare(strict_types=1);

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
header('Content-Type: application/json; charset=utf-8');

if (isset($_GET['debug'])) {
  echo json_encode(['where' => 'create-order.php', 'method' => $method]);
  exit;
}
if (!in_array($method, ['POST', 'OPTIONS', 'HEAD'], true)) {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed', 'got' => $method]);
  exit;
}
if ($method === 'OPTIONS' || $method === 'HEAD') {
  http_response_code(204);
  exit;
}

$BACKEND_BASE = 'https://plantilladecantidades.onrender.com';
$pathNoSlash  = '/api/paypal/create-order';
$pathWith     = '/api/paypal/create-order/';

$input = file_get_contents('php://input');
if ($input === false) {
  $input = '{}';
}

function forward_json(string $url, string $body): array {
  $ch = curl_init($url);
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => [
      'Content-Type: application/json',
      'Accept: application/json',
      'Expect:'
    ],
    CURLOPT_POSTFIELDS     => $body,
    CURLOPT_TIMEOUT        => 30,
  ]);
  $respBody = curl_exec($ch);
  $err      = curl_error($ch);
  $code     = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  return [$code, $respBody, $err];
}

[$code, $body, $err] = forward_json($BACKEND_BASE . $pathNoSlash, $input);
if ($err) {
  http_response_code(502);
  echo json_encode(['error' => 'Upstream error', 'detail' => $err]);
  exit;
}
if (in_array($code, [404, 405], true)) {
  $altPath = ($pathNoSlash[strlen($pathNoSlash) - 1] === '/') ? rtrim($pathNoSlash, '/') : $pathWith;
  [$code2, $body2, $err2] = forward_json($BACKEND_BASE . $altPath, $input);
  if ($err2) {
    http_response_code(502);
    echo json_encode(['error' => 'Upstream error (alt)', 'detail' => $err2]);
    exit;
  }
  http_response_code($code2 ?: 200);
  echo $body2 ?: '{}';
  exit;
}
http_response_code($code ?: 200);
echo $body ?: '{}';
