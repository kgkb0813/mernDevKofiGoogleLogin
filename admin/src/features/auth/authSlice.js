import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAuth } from 'firebase/auth';

const user = JSON.parse(localStorage.getItem("user"))

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, thunkApi) => {
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(userData)
    });

    if (!res.ok) {
      const error = await res.json();
      return thunkApi.rejectWithValue(error);
    }

    const data = await res.json();
    return data
    }
    catch (err) {
      return thunkApi.rejectWithValue(err.message)
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, thunkApi) => {
    try {
      const res = await fetch("/api/users/login", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const error = await res.json();
        return thunkApi.rejectWithValue(error);
      }

      const data = await res.json();

      //   set the data in localstorage
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const loginGoogle = createAsyncThunk(
  "auth/google",
  async (userData, thunkApi) => {
    try {
      const res = await fetch("/api/users/google", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const error = await res.json();
        return thunkApi.rejectWithValue(error);
      }
      const data = await res.json();

      //   set the data in localstorage
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const loginGithub = createAsyncThunk(
  "auth/github",
  async (userData, thunkApi) => {
    try {
      const res = await fetch("/api/users/github", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const error = await res.json();
        return thunkApi.rejectWithValue(error);
      }
      const data = await res.json();

      //   set the data in localstorage
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, thunkApi) => {
    try {
      const res = await fetch("/api/users/logout")
      if(!res.ok) {
        const error = await res.json();
        return thunkApi.rejectWithValue(error);
      }
      
      localStorage.removeItem("user")
      const data = res.json();
      return data; 
    }
    catch (err) {
      return thunkApi.rejectWithValue(err.message)
    }
  }
);

export const deleteUser = createAsyncThunk(
  'auth/delete',
  async (userData, thunkApi) => {
    try {
      const res = await fetch(`/api/users/delete/${userData._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userData._id }),
      });

      if (!res.ok) {
        const error = await res.json();
        return thunkApi.rejectWithValue(error);
      }

      localStorage.removeItem("user")
      const data = await res.json();
      return data;
    } 
    catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const deleteSocial = createAsyncThunk(
  'auth/deleteSocial',
  async (userData, thunkApi) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert('No user is currently logged in.');
      return;
    }

    try {
      console.log("==mid: ", userData)
      console.log("==uid: ", user.uid)
      const res = await fetch("/api/users/deleteSocial", {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mid: userData, uid: user.uid }),
      });

    if (!res.ok) {
      const error = await res.json();
      alert(error.error || 'Failed to delete account.');
    }  
    // localStorage.removeItem("user")
      const data = await res.json();
      alert(data.message); // 서버에서 보낸 응답 메시지 표시
      return data; 
    }
    catch (err) {
      // console.error('Error deleting account:', err);
      // alert('Failed to delete account.');
      return thunkApi.rejectWithValue(err.message)
    }
  }
);

const initialState = {
  user: user? user : null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ""
};


export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(loginGoogle.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(loginGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(loginGithub.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginGithub.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(loginGithub.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = null;  //user정보를 삭제
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload; //error message 전달
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = null;  //user정보를 삭제
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload; //error message 전달
      })
      .addCase(deleteSocial.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSocial.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = null;  //user정보를 삭제
      })
      .addCase(deleteSocial.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload; //error message 전달
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
