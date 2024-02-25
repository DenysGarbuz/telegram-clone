import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { User } from "@/types";

interface State {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isError: boolean;
}

const initialState: State = {
  token: null,
  user: null,
  isLoading: false,
  isError: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(store, { payload }) {
      store.token = payload;
    },
    setUser(store, { payload }: PayloadAction<User | null>) {
      store.user = payload;
    },
    setIsError(store, { payload }: PayloadAction<boolean>) {
      store.isError = payload;
    },
    setIsLoading(store, { payload }: PayloadAction<boolean>) {
      store.isLoading = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      //login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.isError = payload;
      })
      //register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.isError = payload;
      });
  },
});

export const actions = authSlice.actions;
export default authSlice.reducer;

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.error);
      } else {
        return rejectWithValue("Erorr");
      }
    }
  }
);
