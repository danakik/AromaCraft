import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const clearErrorApi = createApi({
  reducerPath: 'clearErrorApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://craftstore.com.ua/data/',
    responseHandler: 'text',
  }),
  endpoints: (builder) => ({
    clearError: builder.mutation<any, { key: string }>({
      query: ({ key }) => ({
        url: 'clear_alarm.php',
        method: 'POST',
        body: new URLSearchParams({
          key: key,
        }),
      }),
    }),
  }),
});

export const { useClearErrorMutation } = clearErrorApi;
export default clearErrorApi;
