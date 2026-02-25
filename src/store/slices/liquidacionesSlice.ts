import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "@/lib/axios";

export type LiquidacionStatus = "PENDING" | "DISTRIBUTED" | "FAILED";

export interface Liquidacion {
  id: string;
  projectId: string;
  project: { id: string; name: string; expectedReturn: number };
  totalSalesAmount: number;
  yieldAmount: number;
  distributedTo: number;
  status: LiquidacionStatus;
  notes?: string;
  distributedAt?: string;
  createdAt: string;
}

export interface LiquidacionPreview {
  project: { id: string; name: string; expectedReturn: number };
  totalSalesAmount: number;
  yieldPercentage: number;
  yieldAmount: number;
  totalInvestors: number;
  totalTokens: number;
  distributions: {
    investorId: string;
    walletAddress: string;
    tokens: number;
    percentage: string;
    amount: string;
  }[];
}

export interface CreateLiquidacionDto {
  projectId: string;
  totalSalesAmount: number;
  notes?: string;
}

interface LiquidacionesState {
  liquidaciones: Liquidacion[];
  preview: LiquidacionPreview | null;
  isLoading: boolean;
  isLoadingPreview: boolean;
  error: string | null;
}

const initialState: LiquidacionesState = {
  liquidaciones: [],
  preview: null,
  isLoading: false,
  isLoadingPreview: false,
  error: null,
};

export const fetchLiquidaciones = createAsyncThunk<Liquidacion[], string | undefined>(
  "liquidaciones/fetchAll",
  async (projectId, { rejectWithValue }) => {
    try {
      const url = projectId ? `/liquidaciones?projectId=${projectId}` : "/liquidaciones";
      return await apiRequest<Liquidacion[]>("get", url);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Error al cargar liquidaciones");
    }
  }
);

export const fetchLiquidacionPreview = createAsyncThunk<
  LiquidacionPreview,
  { projectId: string; totalSalesAmount: number }
>(
  "liquidaciones/preview",
  async ({ projectId, totalSalesAmount }, { rejectWithValue }) => {
    try {
      return await apiRequest<LiquidacionPreview>(
        "get",
        `/liquidaciones/preview?projectId=${projectId}&totalSalesAmount=${totalSalesAmount}`
      );
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Error al calcular preview");
    }
  }
);

export const createLiquidacion = createAsyncThunk<Liquidacion, CreateLiquidacionDto>(
  "liquidaciones/create",
  async (dto, { rejectWithValue }) => {
    try {
      return await apiRequest<Liquidacion>("post", "/liquidaciones", dto);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Error al crear liquidación");
    }
  }
);

const liquidacionesSlice = createSlice({
  name: "liquidaciones",
  initialState,
  reducers: {
    clearPreview: (state) => { state.preview = null; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLiquidaciones.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchLiquidaciones.fulfilled, (state, action) => { state.isLoading = false; state.liquidaciones = action.payload; })
      .addCase(fetchLiquidaciones.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; })

      .addCase(fetchLiquidacionPreview.pending, (state) => { state.isLoadingPreview = true; state.preview = null; })
      .addCase(fetchLiquidacionPreview.fulfilled, (state, action) => { state.isLoadingPreview = false; state.preview = action.payload; })
      .addCase(fetchLiquidacionPreview.rejected, (state, action) => { state.isLoadingPreview = false; state.error = action.payload as string; })

      .addCase(createLiquidacion.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(createLiquidacion.fulfilled, (state, action) => { state.isLoading = false; state.liquidaciones.unshift(action.payload); })
      .addCase(createLiquidacion.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; });
  },
});

export const { clearPreview, clearError } = liquidacionesSlice.actions;
export default liquidacionesSlice.reducer;
