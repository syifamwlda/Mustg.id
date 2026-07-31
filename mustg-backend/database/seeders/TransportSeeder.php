<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Transport;

class TransportSeeder extends Seeder {
    public function run(): void {
        $data = [
            ['name'=>'Honda Beat / Vario',    'icon'=>'🛵','type'=>'MOTOR',  'capacity'=>2, 'price_per_day'=>75000,   'description'=>'Motor matic, termasuk helm & jas hujan',   'plate_number'=>'AB 1234 CD'],
            ['name'=>'Toyota Avanza',          'icon'=>'🚗','type'=>'MOBIL',  'capacity'=>7, 'price_per_day'=>350000,  'description'=>'Kapasitas 7 orang, termasuk bensin & supir','plate_number'=>'AB 5678 EF'],
            ['name'=>'Daihatsu Xenia',         'icon'=>'🚗','type'=>'MOBIL',  'capacity'=>7, 'price_per_day'=>320000,  'description'=>'Kapasitas 7 orang, AC, bensin & supir',    'plate_number'=>'AB 9012 GH'],
            ['name'=>'Toyota Hiace',           'icon'=>'🚐','type'=>'MINIBUS','capacity'=>12,'price_per_day'=>600000,  'description'=>'Kapasitas 12 orang, cocok rombongan kecil','plate_number'=>'AB 3456 IJ'],
            ['name'=>'Isuzu Elf',              'icon'=>'🚐','type'=>'MINIBUS','capacity'=>16,'price_per_day'=>750000,  'description'=>'Kapasitas 16 orang, AC, sound system',     'plate_number'=>'AB 7890 KL'],
            ['name'=>'Bus Pariwisata 30 seat', 'icon'=>'🚌','type'=>'BUS',    'capacity'=>30,'price_per_day'=>1500000, 'description'=>'Kapasitas 30 orang, AC & sound system',    'plate_number'=>'AB 1111 MN'],
            ['name'=>'Bus Pariwisata 40 seat', 'icon'=>'🚌','type'=>'BUS',    'capacity'=>40,'price_per_day'=>1800000, 'description'=>'Kapasitas 40 orang, AC, toilet, WiFi',     'plate_number'=>'AB 2222 OP'],
        ];
        foreach ($data as $d) {
            Transport::create($d);
        }
        $this->command->info('Seeded ' . count($data) . ' transports.');
    }
}
