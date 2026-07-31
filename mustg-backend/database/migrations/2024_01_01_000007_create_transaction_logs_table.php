<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('transaction_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->string('event', 50);
            $table->string('description', 255)->nullable();
            $table->string('actor', 100)->nullable();
            $table->timestamps();
            $table->index('order_id');
        });
    }
    public function down(): void { Schema::dropIfExists('transaction_logs'); }
};
