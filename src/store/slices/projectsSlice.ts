import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiRequest } from "@/lib/axios";
import type {
  Project,
  CreateProjectDto,
  UpdateProjectDto,
  ProjectStatus,
} from "../types";

interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status: ProjectStatus | null;
    search: string;
  };
}

const initialState: ProjectsState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
  filters: {
    status: null,
    search: "",
  },
};

// === ASYNC THUNKS ===

export const fetchProjects = createAsyncThunk<Project[], ProjectStatus | undefined>(
  "projects/fetchProjects",
  async (status, { rejectWithValue }) => {
    try {
      const url = status ? `/projects?status=${status}` : "/projects";
      return await apiRequest<Project[]>("get", url);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Error al cargar proyectos");
    }
  }
);

export const fetchProjectById = createAsyncThunk<Project, string>(
  "projects/fetchProjectById",
  async (id, { rejectWithValue }) => {
    try {
      return await apiRequest<Project>("get", `/projects/${id}`);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Proyecto no encontrado");
    }
  }
);

export const createProject = createAsyncThunk<Project, CreateProjectDto>(
  "projects/createProject",
  async (data, { rejectWithValue }) => {
    try {
      return await apiRequest<Project>("post", "/projects", data);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Error al crear proyecto");
    }
  }
);

export const updateProject = createAsyncThunk<
  Project,
  { id: string; data: UpdateProjectDto }
>(
  "projects/updateProject",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await apiRequest<Project>("patch", `/projects/${id}`, data);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Error al actualizar proyecto");
    }
  }
);

export const updateProjectStatus = createAsyncThunk<
  Project,
  { id: string; status: ProjectStatus }
>(
  "projects/updateProjectStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await apiRequest<Project>("patch", `/projects/${id}/status/${status}`);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Error al cambiar estado");
    }
  }
);

export const deleteProject = createAsyncThunk<string, string>(
  "projects/deleteProject",
  async (id, { rejectWithValue }) => {
    try {
      await apiRequest<void>("delete", `/projects/${id}`);
      return id;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || "Error al eliminar proyecto");
    }
  }
);

// === SLICE ===

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setStatusFilter: (state, action: PayloadAction<ProjectStatus | null>) => {
      state.filters.status = action.payload;
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchProjects
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // fetchProjectById
    builder
      .addCase(fetchProjectById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // createProject
    builder
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects.unshift(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // updateProject
    builder
      .addCase(updateProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.projects.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        state.currentProject = action.payload;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // updateProjectStatus
    builder
      .addCase(updateProjectStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProjectStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.projects.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload;
        }
      })
      .addCase(updateProjectStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // deleteProject
    builder
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = state.projects.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setStatusFilter,
  setSearchFilter,
  clearCurrentProject,
  clearError,
} = projectsSlice.actions;

export default projectsSlice.reducer;
