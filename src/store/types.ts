// User types
export type UserRole = "SUPER_ADMIN" | "ADMIN" | "INVESTOR";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isCheckingAuth: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Project types
export type ProjectStatus = "DRAFT" | "FUNDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  image?: string;
  images: string[];
  documents: string[];
  tokenPrice: number;
  totalTokens: number;
  tokensSold: number;
  minInvestment: number;
  maxInvestment?: number;
  expectedReturn: number;
  expectedReturnMax?: number;
  projectValue: number;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  name: string;
  slug: string;
  description: string;
  location: string;
  targetAmount: number;
  images?: string[];
  documents?: string[];
  tokenPrice: number;
  totalTokens: number;
  minInvestment: number;
  maxInvestment?: number;
  expectedReturn: number;
  expectedReturnMax?: number;
  projectValue: number;
  status?: ProjectStatus;
  startDate?: string;
  endDate?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {}

// Investor types
export type KycStatus = "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED";

export interface Investor {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  documentType: string;
  documentNumber: string;
  walletAddress?: string;
  kycStatus: KycStatus;
  kycData?: {
    fullName?: string;
    birthDate?: string;
    nationality?: string;
    documentFrontUrl?: string;
    documentBackUrl?: string;
    selfieUrl?: string;
    submittedAt?: string;
    reviewedAt?: string;
    reviewComment?: string;
    [key: string]: unknown;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateKycStatusDto {
  status: KycStatus;
  kycData?: {
    reviewComment?: string;
    reviewedAt?: string;
    [key: string]: unknown;
  };
}

// Dashboard types
export interface DashboardStats {
  totalInvestors: number;
  activeInvestors: number;
  totalProjects: number;
  activeProjects: number;
  pendingKyc: number;
  totalInvested: number;
  totalRaised: number;
}

// API Response types
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
