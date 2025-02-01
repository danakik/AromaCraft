import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const reedReceptsApi = createApi({
  reducerPath: 'reedReceptsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://craftstore.com.ua/data/samogon/',
    responseHandler: 'text',
  }),
  endpoints: (builder) => ({
    reedRecepts: builder.mutation<any, Record<string, any>>({
      query: (data) => ({
        url: 'read_recepts.php',
        method: 'POST',
        body: new URLSearchParams(data),
      }),
      transformResponse: (response: string) => {
        const lines = response.split('\n').map((line) => (line.trim() === '' ? '---' : line));
        lines[0] = 'Автоматика';
        return lines;
      },
    }),
  }),
});

export const { useReedReceptsMutation } = reedReceptsApi;
export default reedReceptsApi;
