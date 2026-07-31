<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ticket_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('destination_id')
                  ->constrained()
                  ->cascadeOnDelete();
            $table->string('name', 100);
            $table->unsignedInteger('price');
            $table->text('description')->nullable();
            $table->timestamps();
            $table->index('destination_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ticket_types');
    }
};
