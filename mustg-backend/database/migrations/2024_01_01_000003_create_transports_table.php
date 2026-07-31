<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('transports', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('icon', 10)->default('🚗');
            $table->enum('type', ['MOTOR','MOBIL','MINIBUS','BUS']);
            $table->unsignedTinyInteger('capacity');
            $table->unsignedInteger('price_per_day');
            $table->string('description', 200)->nullable();
            $table->string('plate_number', 20)->nullable();
            $table->boolean('is_available')->default(true);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('transports'); }
};
