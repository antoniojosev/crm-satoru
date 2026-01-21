import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiRequest } from "@/lib/axios";
import type { Investor, KycStatus, UpdateKycStatusDto } from "../types";

interface InvestorsState {
  investors: Investor[];
  currentInvestor: Investor | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    kycStatus: KycStatus | null;
    search: string;
  };
}

const initialState: InvestorsState = {
  investors: [],
  currentInvestor: null,
  isLoading: false,
  error: null,
  filters: {
    kycStatus: null,
    search: "",
  },
};

// === ASYNC THUNKS ===

export const fetchInvestors = createAsyncThunk<
  Investor[],
  { kycStatus?: KycStatus; search?: string } | undefined
>(
  "investors/fetchInvestors",
  async (params, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.kycStatus) queryParams.append("kycStatus", params.kycStatus);
      if (params?.search) queryParams.append("search", params.search);

      const url = queryParams.toString()
        ? `/investors?${queryParams.toString()}`
        : "/investors";

      return await apiRequest<Investor[]>("get", url);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Error al cargar inversores");
    }
  }
);

export const fetchInvestorById = createAsyncThunk<Investor, string>(
  "investors/fetchInvestorById",
  async (id, { rejectWithValue }) => {
    try {
      return await apiRequest<Investor>("get", `/investors/${id}`);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Inversor no encontrado");
    }
  }
);

export const updateKycStatus = createAsyncThunk<
  Investor,
  { id: string; data: UpdateKycStatusDto }
>(
  "investors/updateKycStatus",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await apiRequest<Investor>("patch", `/investors/${id}/kyc`, data);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Error al actualizar KYC");
    }
  }
);

// === SLICE ===

const investorsSlice = createSlice({
  name: "investors",
  initialState,
  reducers: {
    setKycStatusFilter: (state, action: PayloadAction<KycStatus | null>) => {
      state.filters.kycStatus = action.payload;
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
    clearCurrentInvestor: (state) => {
      state.currentInvestor = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchInvestors
    builder
      .addCase(fetchInvestors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInvestors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.investors = action.payload;
      })
      .addCase(fetchInvestors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // fetchInvestorById
    builder
      .addCase(fetchInvestorById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInvestorById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentInvestor = action.payload;
      })
      .addCase(fetchInvestorById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // updateKycStatus
    builder
      .addCase(updateKycStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateKycStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.investors.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) {
          state.investors[index] = action.payload;
        }
        if (state.currentInvestor?.id === action.payload.id) {
          state.currentInvestor = action.payload;
        }
      })
      .addCase(updateKycStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setKycStatusFilter,
  setSearchFilter,
  clearCurrentInvestor,
  clearError,
} = investorsSlice.actions;

export default investorsSlice.reducer;
