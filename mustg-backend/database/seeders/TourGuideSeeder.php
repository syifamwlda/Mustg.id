<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\TourGuide;

class TourGuideSeeder extends Seeder {
    public function run(): void {
        $data = [
            ['name'=>'Agus Santoso',    'photo_url'=>'https://randomuser.me/api/portraits/men/42.jpg',   'languages'=>'Indonesia, English',          'rating'=>4.9,'total_tours'=>312,'price_per_day'=>250000,'specialization'=>'Candi & Heritage',  'badge'=>'Top Guide',    'phone'=>'081234567890','license_number'=>'HPI-2019-001'],
            ['name'=>'Dewi Rahayu',     'photo_url'=>'https://randomuser.me/api/portraits/women/35.jpg', 'languages'=>'Indonesia, English, Mandarin','rating'=>4.8,'total_tours'=>198,'price_per_day'=>300000,'specialization'=>'Multilingual Tour',  'badge'=>'Multilingual', 'phone'=>'082345678901','license_number'=>'HPI-2020-002'],
            ['name'=>'Rizky Prasetyo',  'photo_url'=>'https://randomuser.me/api/portraits/men/28.jpg',   'languages'=>'Indonesia',                   'rating'=>4.7,'total_tours'=>145,'price_per_day'=>150000,'specialization'=>'Alam & Adventure',  'badge'=>'Adventure',    'phone'=>'083456789012','license_number'=>'HPI-2021-003'],
            ['name'=>'Sari Wulandari',  'photo_url'=>'https://randomuser.me/api/portraits/women/52.jpg', 'languages'=>'Indonesia, English',          'rating'=>4.8,'total_tours'=>220,'price_per_day'=>200000,'specialization'=>'Budaya & Kuliner',  'badge'=>'Recommended',  'phone'=>'084567890123','license_number'=>'HPI-2019-004'],
            ['name'=>'Budi Hartono',    'photo_url'=>'https://randomuser.me/api/portraits/men/61.jpg',   'languages'=>'Indonesia, Javanese',         'rating'=>4.6,'total_tours'=>89, 'price_per_day'=>125000,'specialization'=>'Sejarah Keraton',   'badge'=>null,           'phone'=>'085678901234','license_number'=>'HPI-2022-005'],
        ];
        foreach ($data as $d) {
            TourGuide::create($d);
        }
        $this->command->info('Seeded ' . count($data) . ' tour guides.');
    }
}
