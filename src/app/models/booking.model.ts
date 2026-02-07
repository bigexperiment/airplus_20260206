export interface Booking {
  id: number;
  trekId: number;
  trekName?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  numberOfPeople: number;
  preferredDate: Date;
  message?: string;
  status: BookingStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export interface BookingRequest {
  trekId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  numberOfPeople: number;
  preferredDate: Date;
  message?: string;
}
