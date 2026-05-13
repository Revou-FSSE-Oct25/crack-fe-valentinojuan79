export type Role = "CUSTOMER" | "ADMIN" | "TECHNICIAN";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ON_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  address?: string;
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
}

export interface Booking {
  id: string;
  status: BookingStatus;
  schedule: string;
  total_price: number;
  user_id: string;
  user?: User;
  services_id: string;
  services?: Service;
  provider_id?: string;
  provider?: User;
  payment?: Payment;
}
