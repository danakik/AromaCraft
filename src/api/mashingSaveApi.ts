import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const mashingSaveApi = createApi({
  reducerPath: 'mashingSaveApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://craftstore.com.ua/data/samogon/',
    responseHandler: 'text',
  }),
  endpoints: (builder) => ({
    mashingSave: builder.mutation<any, Record<string, any>>({
      query: (data) => ({
        url: 'save_mash.php',
        method: 'POST',
        body: new URLSearchParams(data),
      }),
    }),
  }),
});

export const { useMashingSaveMutation } = mashingSaveApi;
export default mashingSaveApi;
