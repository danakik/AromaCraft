import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const renameReceptApi = createApi({
  reducerPath: 'renameReceptApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://craftstore.com.ua/data/samogon/',
    responseHandler: 'text',
  }),
  endpoints: (builder) => ({
    renameRecept: builder.mutation<any, Record<string, any>>({
      query: (data) => ({
        url: 'rename_recept.php',
        method: 'POST',
        body: new URLSearchParams(data),
      }),
    }),
  }),
});

export const { useRenameReceptMutation } = renameReceptApi;
export default renameReceptApi;