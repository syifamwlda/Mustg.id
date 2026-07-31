<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Destination;
use App\Models\TicketType;

class DestinationSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'name' => 'Prambanan', 'city' => 'Yogyakarta', 'open_hours' => '06:00 - 17:00',
                'description' => 'Kompleks candi Hindu terbesar di Indonesia, cocok untuk wisata sejarah dan foto-foto.',
                'thumbnail_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Prambanan_Temple_Yogyakarta.jpg/1280px-Prambanan_Temple_Yogyakarta.jpg',
                'rating' => 4.8, 'start_price' => 50000, 'hotels' => 1, 'transfers' => 2, 'activities' => 4,
                'tickets' => [
                    ['name' => 'Tiket Dewasa', 'price' => 50000, 'description' => 'Untuk pengunjung usia 18 tahun ke atas'],
                    ['name' => 'Tiket Anak',   'price' => 30000, 'description' => 'Untuk pengunjung usia 3–17 tahun'],
                ],
            ],
            [
                'name' => 'Borobudur', 'city' => 'Magelang', 'open_hours' => '06:30 - 17:00',
                'description' => 'Candi Buddha terbesar di dunia dan salah satu ikon wisata paling terkenal di Indonesia.',
                'thumbnail_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Borobudur-Nothwest-view.jpg/1280px-Borobudur-Nothwest-view.jpg',
                'rating' => 4.9, 'start_price' => 75000, 'hotels' => 1, 'transfers' => 3, 'activities' => 4,
                'tickets' => [
                    ['name' => 'Tiket Masuk',   'price' => 75000, 'description' => 'Tiket reguler termasuk akses ke candi'],
                    ['name' => 'Tiket Pelajar', 'price' => 50000, 'description' => 'Untuk pelajar/mahasiswa dengan kartu tanda pelajar'],
                ],
            ],
            [
                'name' => 'Obelix hills', 'city' => 'Yogyakarta', 'open_hours' => '10:00 - 22:00',
                'description' => 'View perbukitan yang punya spot foto estetik dan city light yang cantik. Cocok untuk menikmati suasana tenang.',
                'thumbnail_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Sunset_at_Obelix_Hills_Yogyakarta.jpg/1280px-Sunset_at_Obelix_Hills_Yogyakarta.jpg',
                'rating' => 4.6, 'start_price' => 25000, 'hotels' => 0, 'transfers' => 2, 'activities' => 4,
                'tickets' => [
                    ['name' => 'Tiket Masuk', 'price' => 25000, 'description' => 'Akses area Obelix Hills'],
                ],
            ],
            [
                'name' => 'Merapi Park', 'city' => 'Sleman', 'open_hours' => '09:00 - 17:00',
                'description' => 'Landmark belajar mengenal binatang besar dan seluruh dunia dengan cara yang seru dan interaktif.',
                'thumbnail_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Mount_Merapi_From_Klangon_Hill.jpg/1280px-Mount_Merapi_From_Klangon_Hill.jpg',
                'rating' => 4.7, 'start_price' => 75000, 'hotels' => 1, 'transfers' => 2, 'activities' => 4,
                'tickets' => [
                    ['name' => 'Tiket Dewasa', 'price' => 75000, 'description' => 'Akses penuh seluruh area'],
                    ['name' => 'Tiket Anak',   'price' => 55000, 'description' => 'Untuk anak usia 3–12 tahun'],
                ],
            ],
            [
                'name' => 'Keraton', 'city' => 'Yogyakarta', 'open_hours' => '08:00 - 14:00',
                'description' => 'Arsitektur khas Jawa serta berbagai pertunjukan seni tradisional yang masih dilestarikan hingga kini.',
                'thumbnail_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Kraton_Yogyakarta_-_The_Main_Gate_%28Pagelaran%29.jpg/1280px-Kraton_Yogyakarta_-_The_Main_Gate_%28Pagelaran%29.jpg',
                'rating' => 4.6, 'start_price' => 15000, 'hotels' => 0, 'transfers' => 2, 'activities' => 4,
                'tickets' => [
                    ['name' => 'Tiket Masuk',   'price' => 15000, 'description' => 'Tiket masuk reguler'],
                    ['name' => 'Tiket Pelajar', 'price' => 8000,  'description' => 'Khusus pelajar/mahasiswa'],
                    ['name' => 'Tiket Asing',   'price' => 25000, 'description' => 'Untuk wisatawan mancanegara'],
                ],
            ],
            [
                'name' => 'Water Castle', 'city' => 'Yogyakarta', 'open_hours' => '09:00 - 15:00',
                'description' => 'Taman air peninggalan Keraton yang punya spot foto estetik dan suasana heritage.',
                'thumbnail_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Taman_Sari_Yogyakarta.jpg/1280px-Taman_Sari_Yogyakarta.jpg',
                'rating' => 4.6, 'start_price' => 15000, 'hotels' => 0, 'transfers' => 2, 'activities' => 4,
                'tickets' => [
                    ['name' => 'Tiket Masuk', 'price' => 15000, 'description' => 'Akses seluruh area Taman Sari'],
                ],
            ],
            [
                'name' => 'Sindu Kusuma', 'city' => 'Yogyakarta', 'open_hours' => '15:00 - 22:00',
                'description' => 'Taman hiburan keluarga dengan bianglala besar dan berbagai wahana seru.',
                'thumbnail_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Sindu_Kusuma_Edupark.jpg/1280px-Sindu_Kusuma_Edupark.jpg',
                'rating' => 4.8, 'start_price' => 30000, 'hotels' => 0, 'transfers' => 2, 'activities' => 4,
                'tickets' => [
                    ['name' => 'Tiket Masuk', 'price' => 30000, 'description' => 'Akses ke semua wahana dasar'],
                    ['name' => 'Tiket Anak',  'price' => 20000, 'description' => 'Untuk anak di bawah 12 tahun'],
                ],
            ],
            [
                'name' => 'HeHa Sky View', 'city' => 'Gunungkidul', 'open_hours' => '10:00 - 21:00',
                'description' => 'Tempat wisata hits dengan view kota dan ketinggian, cocok buat sunset dan foto malam.',
                'thumbnail_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/HeHa_Sky_View.jpg/1280px-HeHa_Sky_View.jpg',
                'rating' => 4.8, 'start_price' => 20000, 'hotels' => 0, 'transfers' => 2, 'activities' => 4,
                'tickets' => [
                    ['name' => 'Tiket Masuk', 'price' => 20000, 'description' => 'Akses area HeHa Sky View'],
                ],
            ],
            [
                'name' => 'Tebing Breksi', 'city' => 'Sleman', 'open_hours' => '06:00 - 18:00',
                'description' => 'Bekas tambang batu yang disulap jadi wisata alam unik dengan ukiran artistik.',
                'thumbnail_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Tebing_Breksi.jpg/1280px-Tebing_Breksi.jpg',
                'rating' => 4.7, 'start_price' => 10000, 'hotels' => 0, 'transfers' => 2, 'activities' => 4,
                'tickets' => [
                    ['name' => 'Tiket Masuk', 'price' => 10000, 'description' => 'Akses ke Tebing Breksi'],
                ],
            ],
        ];

        foreach ($data as $item) {
            $tickets = $item['tickets'];
            unset($item['tickets']);

            $destination = Destination::create($item);

            foreach ($tickets as $ticket) {
                TicketType::create([
                    'destination_id' => $destination->id,
                    ...$ticket,
                ]);
            }

            $this->command->line("  ✓ {$destination->name} ({$destination->city})");
        }

        $this->command->info('Seeded ' . count($data) . ' destinations with tickets.');
    }
}
