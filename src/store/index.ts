import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import projectsReducer from "./slices/projectsSlice";
import investorsReducer from "./slices/investorsSlice";
import dashboardReducer from "./slices/dashboardSlice";
import liquidacionesReducer from "./slices/liquidacionesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    investors: investorsReducer,
    dashboard: dashboardReducer,
    liquidaciones: liquidacionesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export types
export * from "./types";
