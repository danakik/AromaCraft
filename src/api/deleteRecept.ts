import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const deleteReceptApi = createApi({
  reducerPath: 'deleteReceptApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://craftstore.com.ua/data/samogon/',
    responseHandler: 'text',
  }),
  endpoints: (builder) => ({
    deleteRecept: builder.mutation<any, Record<string, any>>({
      query: (data) => ({
        url: 'delete_recept.php',
        method: 'POST',
        body: new URLSearchParams(data),
      }),
    }),
  }),
});

export const { useDeleteReceptMutation } = deleteReceptApi;
export default deleteReceptApi;