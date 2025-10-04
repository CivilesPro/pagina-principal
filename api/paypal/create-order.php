<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

require __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'OPTIONS' || $method === 'HEAD') { http_response_code(204); exit; }
if ($method !== 'POST') { http_response_code(405); echo json_encode(['error'=>'Method not allowed','got'=>$method]); exit; }

$raw = file_get_contents('php://input') ?: '{}';
$in  = json_decode($raw, true);
$slug = is_array($in) ? ($in['slug'] ?? null) : null;
// currency es referencial; cobramos en USD
$amount = $slug ? get_product_price_usd($slug) : null;

if (!$slug || !$amount) {
  http_response_code(400);
  echo json_encode(['error'=>'invalid_input','detail'=>'slug inválido o sin precio configurado']);
  exit;
}

/** Crea la orden en PayPal */
$payload = [
  'intent' => 'CAPTURE',
  'purchase_units' => [[
    'reference_id' => $slug,
    'amount' => [
      'currency_code' => CURRENCY_CODE,
      'value' => $amount,
    ],
  ]],
  'application_context' => [
    'shipping_preference' => 'NO_SHIPPING'
  ],
];

[$code, $body, $err] = paypal_post('/v2/checkout/orders', $payload);

if ($err) {
  http_response_code(502);
  echo json_encode(['error'=>'paypal_upstream','detail'=>$err]);
  exit;
}

http_response_code($code ?: 200);

// Extrae el orderID para tu frontend (PayPal Buttons lo requiere)
$out = json_decode($body, true);
if (isset($out['id'])) {
  echo json_encode(['orderID'=>$out['id'], 'raw'=>$out]);
} else {
  echo $body ?: '{}';
}
