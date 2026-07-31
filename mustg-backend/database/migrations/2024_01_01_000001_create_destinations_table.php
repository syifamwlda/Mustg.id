<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('destinations', function (Blueprint $table) {
            $table->id();
            $table->string('name', 200);
            $table->string('city', 100);
            $table->string('open_hours', 50)->nullable();
            $table->string('category', 50)->default('Vacation');
            $table->text('description')->nullable();
            $table->string('thumbnail_url')->nullable();
            $table->decimal('rating', 3, 1)->default(0.0)->unsigned();
            $table->unsignedInteger('start_price')->default(0);
            $table->unsignedTinyInteger('hotels')->default(0);
            $table->unsignedTinyInteger('transfers')->default(2);
            $table->unsignedTinyInteger('activities')->default(4);
            $table->timestamps();
            $table->index('city');
            $table->index('rating');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('destinations');
    }
};
