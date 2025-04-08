import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import samogonApi from '../api/samogonApi';
import loginApi from '../api/loginApi';
import mainApi from '../api/mainApi';
import createRoomApi from '../api/createRoomApi';
import saveRoomApi from '../api/saveRoomApi';
import deleteRoomApi from '../api/deleteRoomApi';
import keyReducer from './keySlice';
import saveHandApi from '../api/manualSave';
import saveSettingApi from '../api/settingSave';
import reedRecipeApi from '../api/recipeApi';
import renameRecipeApi from '../api/renameRecipeApi';
import deleteRecipeApi from '../api/deleteRecipeApi';
import distillationSaveApi from '../api/distillationSave';
import rectificationSaveApi from '../api/rectificationSaveApi';
import mashingSaveApi from '../api/mashingSaveApi';
import statisticsDataApi from '../api/statisticsDataApi';
import clearErrorApi from '../api/clearErrorApi';

const store = configureStore({
  reducer: {
    [samogonApi.reducerPath]: samogonApi.reducer,
    [loginApi.reducerPath]: loginApi.reducer,
    [mainApi.reducerPath]: mainApi.reducer,
    [createRoomApi.reducerPath]: createRoomApi.reducer,
    [saveRoomApi.reducerPath]: saveRoomApi.reducer,
    [deleteRoomApi.reducerPath]: deleteRoomApi.reducer,
    [saveHandApi.reducerPath]: saveHandApi.reducer,
    [saveSettingApi.reducerPath]: saveSettingApi.reducer,
    [reedRecipeApi.reducerPath]: reedRecipeApi.reducer,
    [renameRecipeApi.reducerPath]: renameRecipeApi.reducer,
    [deleteRecipeApi.reducerPath]: deleteRecipeApi.reducer,
    [distillationSaveApi.reducerPath]: distillationSaveApi.reducer,
    [rectificationSaveApi.reducerPath]: rectificationSaveApi.reducer,
    [mashingSaveApi.reducerPath]: mashingSaveApi.reducer,
    [statisticsDataApi.reducerPath]: statisticsDataApi.reducer,
    [clearErrorApi.reducerPath]: clearErrorApi.reducer,
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
      saveHandApi.middleware,
      saveSettingApi.middleware,
      reedRecipeApi.middleware,
      renameRecipeApi.middleware,
      deleteRecipeApi.middleware,
      distillationSaveApi.middleware,
      rectificationSaveApi.middleware,
      mashingSaveApi.middleware,
      statisticsDataApi.middleware,
      clearErrorApi.middleware,
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export default store;