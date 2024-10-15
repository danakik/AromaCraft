import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import samogonApi from '../api/samogonApi'; 
import loginApi from '../api/loginApi';
import keyReducer from './keySlice';

const store = configureStore({
  reducer: {
    [samogonApi.reducerPath]: samogonApi.reducer, 
    [loginApi.reducerPath]: loginApi.reducer,
    key: keyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(samogonApi.middleware, loginApi.middleware),
});

setupListeners(store.dispatch);

export default store;