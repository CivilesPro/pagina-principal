<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

require __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'OPTIONS' || $method === 'HEAD') { http_response_code(204); exit; }
if ($method !== 'POST') { http_response_code(405); echo json_encode(['error'=>'Method not allowed','got'=>$method]); exit; }

$raw = file_get_contents('php://input') ?: '{}';
$in  = json_decode($raw, true);
$orderID = is_array($in) ? ($in['orderID'] ?? null) : null;
$slug     = is_array($in) ? ($in['slug']     ?? null) : null;

if (!$orderID || !$slug) {
  http_response_code(400);
  echo json_encode(['error'=>'invalid_input','detail'=>'faltan orderID y/o slug']);
  exit;
}

// Captura
[$code, $body, $err] = paypal_post_empty('/v2/checkout/orders/' . rawurlencode($orderID) . '/capture');

if ($err) {
  http_response_code(502);
  echo json_encode(['error'=>'paypal_upstream','detail'=>$err]);
  exit;
}

http_response_code($code ?: 200);
$out = json_decode($body, true);

// Valida estado (acepta COMPLETED)
$status = $out['status'] ?? null;
if ($status !== 'COMPLETED') {
  echo json_encode(['error'=>'capture_not_completed','raw'=>$out]);
  exit;
}

// Aquí devuelves tu URL de descarga según el slug (ejemplo estático)
$downloads = [
  'almacen-obra' => 'https://www.civilespro.com/descargas/almacen-obra.zip',
  'control-acero' => 'https://www.civilespro.com/descargas/control-acero.zip',
  'pedido-acero' => 'https://www.civilespro.com/descargas/pedido-acero.zip'
];
$downloadUrl = $downloads[$slug] ?? null;

echo json_encode([
  'status'=>'ok',
  'downloadUrl'=>$downloadUrl,
  'raw'=>$out
]);
