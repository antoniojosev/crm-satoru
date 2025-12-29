export interface LoginCredentials {
  email: string;
  password: string;
}

// También definimos lo que devuelve el servidor (basado en tu Swagger)
export interface AuthResponseDTO {
  access_token: string;
  refresh_token: string;
  user: {
    _id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    is_active: boolean;
  };
}
