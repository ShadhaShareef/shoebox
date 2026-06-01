<?php
header('Content-Type: application/json; charset=utf-8');
$stores = [
    [
        'id' => 1,
        'name' => 'Shoebox Kochi Central',
        'address' => '120 Marine Drive, Kochi',
        'city' => 'Kochi',
        'distance' => '1.2 km',
        'hours' => '10am - 9pm',
        'availability' => 'In stock',
    ],
    [
        'id' => 2,
        'name' => 'Shoebox Thrissur Mall',
        'address' => 'Metro Junction, Thrissur',
        'city' => 'Thrissur',
        'distance' => '3.8 km',
        'hours' => '10am - 9pm',
        'availability' => 'Limited',
    ],
    [
        'id' => 3,
        'name' => 'Shoebox Kozhikode High Street',
        'address' => 'Nadakkavu, Kozhikode',
        'city' => 'Kozhikode',
        'distance' => '2.6 km',
        'hours' => '10am - 9pm',
        'availability' => 'Out of stock',
    ],
];
echo json_encode(['stores' => $stores], JSON_UNESCAPED_SLASHES);
