import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import samogonApi from '../api/samogonApi';
import loginApi from '../api/loginApi';
import mainApi from '../api/mainApi';
import createRoomApi from '../api/createRoomApi';
import saveRoomApi from '../api/saveRoomApi';
import deleteRoomApi from '../api/deleteRoomApi';
import keyReducer from './keySlice';

const store = configureStore({
  reducer: {
    [samogonApi.reducerPath]: samogonApi.reducer,
    [loginApi.reducerPath]: loginApi.reducer,
    [mainApi.reducerPath]: mainApi.reducer,
    [createRoomApi.reducerPath]: createRoomApi.reducer,
    [saveRoomApi.reducerPath]: saveRoomApi.reducer,
    [deleteRoomApi.reducerPath]: deleteRoomApi.reducer,
    key: keyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      samogonApi.middleware,
      loginApi.middleware,
      mainApi.middleware,
      createRoomApi.middleware,
      saveRoomApi.middleware,
      deleteRoomApi.middleware,
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export default store;
