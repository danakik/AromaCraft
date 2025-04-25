import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const deleteRecipeApi = createApi({
  reducerPath: 'deleteRecipeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://craftstore.com.ua/data/samogon/',
    responseHandler: 'text',
  }),
  endpoints: (builder) => ({
    deleteRecipe: builder.mutation<any, Record<string, any>>({
      query: (data) => ({
        url: 'delete_recept.php',
        method: 'POST',
        body: new URLSearchParams(data),
      }),
    }),
  }),
});

export const { useDeleteRecipeMutation } = deleteRecipeApi;
export default deleteRecipeApi;
