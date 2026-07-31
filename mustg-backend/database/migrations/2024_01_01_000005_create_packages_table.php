<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->string('name', 200);
            $table->string('category', 50);
            $table->unsignedInteger('price');
            $table->unsignedInteger('original_price');
            $table->string('thumbnail_url')->nullable();
            $table->text('includes');
            $table->string('duration', 30)->default('1 Hari');
            $table->string('min_pax', 30)->default('Min. 2 orang');
            $table->string('badge', 30)->nullable();
            $table->unsignedSmallInteger('max_pax')->default(20);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('package_destinations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('package_id')->constrained()->onDelete('cascade');
            $table->foreignId('destination_id')->constrained()->onDelete('cascade');
        });
    }
    public function down(): void {
        Schema::dropIfExists('package_destinations');
        Schema::dropIfExists('packages');
    }
};
