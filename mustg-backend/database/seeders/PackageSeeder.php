<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Package;
use App\Models\Destination;

class PackageSeeder extends Seeder {
    public function run(): void {
        // Ambil ID destinasi yang sudah ada
        $prambanan = Destination::where('name','Prambanan')->first();
        $borobudur = Destination::where('name','Borobudur')->first();
        $keraton   = Destination::where('name','Keraton')->first();
        $waterCastle = Destination::where('name','Water Castle')->first();
        $merapi    = Destination::where('name','Merapi Park')->first();
        $heha      = Destination::where('name','HeHa Sky View')->first();

        $packages = [
            [
                'name'           => 'Paket Jogja Heritage 1 Hari',
                'category'       => 'Budaya',
                'price'          => 350000,
                'original_price' => 450000,
                'thumbnail_url'  => 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Prambanan_Temple_Yogyakarta.jpg/1280px-Prambanan_Temple_Yogyakarta.jpg',
                'includes'       => "Tiket Prambanan (Dewasa)\nTiket Keraton\nTiket Water Castle\nTransport PP (Avanza)\nTour Guide lokal\nMakan Siang",
                'duration'       => '1 Hari',
                'min_pax'        => 'Min. 2 orang',
                'max_pax'        => 10,
                'badge'          => 'TERLARIS',
                'destinations'   => [$prambanan?->id, $keraton?->id, $waterCastle?->id],
            ],
            [
                'name'           => 'Paket Borobudur Sunrise',
                'category'       => 'Budaya',
                'price'          => 450000,
                'original_price' => 580000,
                'thumbnail_url'  => 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Borobudur-Nothwest-view.jpg/1280px-Borobudur-Nothwest-view.jpg',
                'includes'       => "Tiket Borobudur\nTransport PP (Avanza)\nSarapan Lokal\nTour Guide\nFotografer",
                'duration'       => '1 Hari',
                'min_pax'        => 'Min. 2 orang',
                'max_pax'        => 8,
                'badge'          => 'POPULER',
                'destinations'   => [$borobudur?->id],
            ],
            [
                'name'           => 'Paket Merapi Adventure',
                'category'       => 'Alam',
                'price'          => 550000,
                'original_price' => 700000,
                'thumbnail_url'  => 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Mount_Merapi_From_Klangon_Hill.jpg/1280px-Mount_Merapi_From_Klangon_Hill.jpg',
                'includes'       => "Tiket Merapi Park\nJeep Lava Tour\nTransport PP (Avanza)\nMakan Siang\nTour Guide Adventure",
                'duration'       => '1 Hari',
                'min_pax'        => 'Min. 2 orang',
                'max_pax'        => 8,
                'badge'          => 'SERU',
                'destinations'   => [$merapi?->id],
            ],
            [
                'name'           => 'Paket Jogja 2 Hari 1 Malam',
                'category'       => 'Budaya',
                'price'          => 1200000,
                'original_price' => 1600000,
                'thumbnail_url'  => 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Kraton_Yogyakarta_-_The_Main_Gate_%28Pagelaran%29.jpg/1280px-Kraton_Yogyakarta_-_The_Main_Gate_%28Pagelaran%29.jpg',
                'includes'       => "Tiket 5 Destinasi (Prambanan, Borobudur, Keraton, Water Castle, HeHa)\nHotel Bintang 3 (1 malam)\nTransport selama tour (Hiace)\n2x Makan\nTour Guide full day",
                'duration'       => '2H1M',
                'min_pax'        => 'Min. 2 orang',
                'max_pax'        => 12,
                'badge'          => 'LENGKAP',
                'destinations'   => array_filter([$prambanan?->id,$borobudur?->id,$keraton?->id,$waterCastle?->id,$heha?->id]),
            ],
        ];

        foreach ($packages as $pkgData) {
            $destIds = $pkgData['destinations'] ?? [];
            unset($pkgData['destinations']);
            $package = Package::create($pkgData);
            $package->destinations()->attach(array_filter($destIds));
            $this->command->line("  ✓ {$package->name}");
        }

        $this->command->info('Seeded ' . count($packages) . ' packages.');
    }
}
