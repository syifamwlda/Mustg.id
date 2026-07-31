<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'destination_id'  => ['required', 'integer', 'exists:destinations,id'],
            'ticket_type_id'  => ['required', 'integer', 'exists:ticket_types,id'],
            'visit_date'      => ['required', 'date', 'after_or_equal:today'],
            'qty'             => ['required', 'integer', 'min:1', 'max:20'],
            'customer_name'   => ['required', 'string', 'max:255'],
            'customer_phone'  => ['required', 'string', 'min:10', 'max:20'],
            'customer_email'  => ['required', 'email', 'max:255'],
            'payment_method'  => ['required', 'in:Card,BANK_TRANSFER,EWALLET'],
        ];
    }

    public function messages(): array
    {
        return [
            'destination_id.exists' => 'Destinasi tidak ditemukan.',
            'ticket_type_id.exists' => 'Jenis tiket tidak ditemukan.',
            'visit_date.after_or_equal' => 'Tanggal kunjungan tidak boleh di masa lalu.',
            'qty.max' => 'Maksimal 20 tiket per transaksi.',
            'payment_method.in' => 'Metode pembayaran tidak valid.',
        ];
    }
}
