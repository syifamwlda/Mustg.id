<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('tour_guides', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('photo_url')->nullable();
            $table->string('languages', 200)->default('Indonesia');
            $table->decimal('rating', 3, 1)->default(5.0);
            $table->unsignedSmallInteger('total_tours')->default(0);
            $table->unsignedInteger('price_per_day');
            $table->string('specialization', 100)->nullable();
            $table->string('badge', 50)->nullable();
            $table->string('phone', 25)->nullable();
            $table->string('license_number', 50)->nullable();
            $table->boolean('is_available')->default(true);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('tour_guides'); }
};
