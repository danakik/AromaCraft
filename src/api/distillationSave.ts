import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const distillationSaveApi = createApi({
  reducerPath: 'distillationSaveApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://craftstore.com.ua/data/samogon/',
    responseHandler: 'text',
  }),
  endpoints: (builder) => ({
    distillationSave: builder.mutation<any, Record<string, any>>({
      query: (data) => ({
        url: 'save_dist.php',
        method: 'POST',
        body: new URLSearchParams(data),
      }),
    }),
  }),
});

export const { useDistillationSaveMutation } = distillationSaveApi;
export default distillationSaveApi;