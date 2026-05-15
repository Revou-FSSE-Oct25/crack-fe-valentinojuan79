export type Role = "CUSTOMER" | "ADMIN" | "TECHNICIAN";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ON_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

export type GatewayMethod =
  | "VA_BCA"
  | "VA_BNI"
  | "VA_BRI"
  | "VA_MANDIRI"
  | "QRIS"
  | "GOPAY";

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  address?: string;
  province?: string;
  city?: string;
  role: Role;
  createdAt: string;
}

export interface Category {
  id: string;
  category_name: string;
}

export interface ServiceVariant {
  id: string;
  variant_name: string;
  price: number;
  service_id: string;
}

export interface Service {
  id: string;
  services_name: string;
  price: number;
  category_id: string;
  category?: Category;
  variants?: ServiceVariant[];
}

export interface Payment {
  id: string;
  method: string;
  status: PaymentStatus;
  amount_to_pay: number;
  booking_id: string;
  // Field gateway Midtrans
  snap_token?: string;
  payment_url?: string;
  va_number?: string;
  qr_url?: string;
  paid_at?: string;
  expired_at?: string;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  booking_id: string;
  technician_id: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  status: BookingStatus;
  schedule: string;
  total_price: number;
  address?: string;
  province?: string;
  city?: string;
  proof_url?: string;
  user_id: string;
  user?: User;
  services_id: string;
  services?: Service;
  provider_id?: string;
  provider?: User;
  payment?: Payment;
  review?: Review;
}

export interface TechnicianWithRating extends User {
  average_rating: number | null;
  review_count: number;
  reviews: Array<{
    rating: number;
    comment?: string;
    createdAt: string;
    booking: { services: { services_name: string } };
  }>;
}

// Response dari POST /payments/gateway
export interface GatewayPaymentResponse {
  payment_id: string;
  method: string;
  amount: number;
  snap_token: string;
  payment_url: string;
  expired_at: string;
}
