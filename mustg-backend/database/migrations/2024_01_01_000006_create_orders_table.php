<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_code', 30)->unique();
            $table->foreignId('destination_id')->constrained();
            $table->foreignId('ticket_type_id')->constrained();

            // Addon — nullable karena opsional
            $table->foreignId('transport_id')->nullable()->constrained('transports')->nullOnDelete();
            $table->foreignId('tour_guide_id')->nullable()->constrained('tour_guides')->nullOnDelete();
            $table->foreignId('package_id')->nullable()->constrained('packages')->nullOnDelete();

            $table->date('visit_date');
            $table->unsignedSmallInteger('qty');

            // Data pemesan
            $table->string('customer_name', 255);
            $table->string('customer_phone', 25);
            $table->string('customer_email', 255);

            // Pembayaran
            $table->enum('payment_method', ['BANK_TRANSFER','EWALLET','CARD'])->default('BANK_TRANSFER');
            $table->unsignedBigInteger('ticket_subtotal');
            $table->unsignedBigInteger('transport_subtotal')->default(0);
            $table->unsignedBigInteger('guide_subtotal')->default(0);
            $table->unsignedBigInteger('total');

            // Status
            $table->enum('payment_status', ['PENDING','CONFIRMED','EXPIRED','REFUNDED'])->default('PENDING');
            $table->enum('order_status', ['WAITING_PAYMENT','PAID','CANCELLED','COMPLETED','RESCHEDULED'])->default('WAITING_PAYMENT');

            $table->string('proof_path')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamps();

            $table->index('customer_email');
            $table->index('visit_date');
        });
    }
    public function down(): void { Schema::dropIfExists('orders'); }
};
