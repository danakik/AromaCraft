import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const saveSettingApi = createApi({
  reducerPath: 'saveSettingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://craftstore.com.ua/data/samogon/',
    responseHandler: 'text',
  }),
  endpoints: (builder) => ({
    saveSetting: builder.mutation<any, Record<string, any>>({
      query: (data) => ({
        url: 'save_settings.php',
        method: 'POST',
        body: new URLSearchParams(data),
      }),
    }),
  }),
});

export const { useSaveSettingMutation } = saveSettingApi;
export default saveSettingApi;