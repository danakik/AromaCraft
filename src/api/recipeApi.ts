import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const reedRecipeApi = createApi({
  reducerPath: 'reedRecipesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://craftstore.com.ua/data/samogon/',
    responseHandler: 'text',
  }),
  endpoints: (builder) => ({
    reedRecipe: builder.mutation<any, Record<string, any>>({
      query: (data) => ({
        url: 'read_recepts.php',
        method: 'POST',
        body: new URLSearchParams(data),
      }),
      transformResponse: (response: string) => {
        const recipeList = response.split('\n').map((line) => (line.trim() === '' ? '---' : line));
        const recipeCount = recipeList[0];
        recipeList[0] = 'Автоматика';
        return { recipeList, recipeCount };
      },
    }),
  }),
});

export const { useReedRecipeMutation } = reedRecipeApi;
export default reedRecipeApi;
