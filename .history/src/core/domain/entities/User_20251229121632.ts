export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "investor";
  isActive: boolean;
  createdAt: Date;
}
