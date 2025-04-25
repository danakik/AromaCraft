import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const renameRecipeApi = createApi({
  reducerPath: 'renameRecipeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://craftstore.com.ua/data/samogon/',
    responseHandler: 'text',
  }),
  endpoints: (builder) => ({
    renameRecipe: builder.mutation<any, Record<string, any>>({
      query: (data) => ({
        url: 'rename_recept.php',
        method: 'POST',
        body: new URLSearchParams(data),
      }),
    }),
  }),
});

export const { useRenameRecipeMutation } = renameRecipeApi;
export default renameRecipeApi;
