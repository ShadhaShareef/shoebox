<?php
header('Content-Type: application/json; charset=utf-8');
$productId = isset($_GET['product_id']) ? (int)$_GET['product_id'] : 0;
$base = [
    [
        'id' => 1,
        'author' => 'Arun M.',
        'rating' => 5,
        'headline' => 'Comfort meets style',
        'body' => 'The fit was perfect and the delivery was fast. Great support for everyday wear.',
        'created_at' => '2 days ago',
    ],
    [
        'id' => 2,
        'author' => 'Leena S.',
        'rating' => 4,
        'headline' => 'Premium finish',
        'body' => 'Feels very premium and the cushioning is excellent for long walks.',
        'created_at' => '1 week ago',
    ],
    [
        'id' => 3,
        'author' => 'Vishal P.',
        'rating' => 5,
        'headline' => 'Perfect for Kerala weather',
        'body' => 'Breathable and lightweight. I wear them on weekends and they still look new.',
        'created_at' => '3 weeks ago',
    ],
];
if ($productId === 0) {
    echo json_encode(['reviews' => $base], JSON_UNESCAPED_SLASHES);
    exit;
}
$reviews = array_map(function ($review) use ($productId) {
    $review['id'] += $productId * 10;
    return $review;
}, $base);
echo json_encode(['reviews' => $reviews], JSON_UNESCAPED_SLASHES);
