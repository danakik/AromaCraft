import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const rectificationSaveApi = createApi({
  reducerPath: 'rectificationSaveApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://craftstore.com.ua/data/samogon/',
    responseHandler: 'text',
  }),
  endpoints: (builder) => ({
    rectificationSave: builder.mutation<any, Record<string, any>>({
      query: (data) => ({
        url: 'save_rect.php',
        method: 'POST',
        body: new URLSearchParams(data),
      }),
    }),
  }),
});

export const { useRectificationSaveMutation } = rectificationSaveApi;
export default rectificationSaveApi;
