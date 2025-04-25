import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const saveHandApi = createApi({
  reducerPath: 'saveHandApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://craftstore.com.ua/data/samogon/',
    responseHandler: 'text',
  }),
  endpoints: (builder) => ({
    saveHand: builder.mutation<any, Record<string, any>>({
      query: (data) => ({
        url: 'save_hand.php',
        method: 'POST',
        body: new URLSearchParams(data),
      }),
    }),
  }),
});

export const { useSaveHandMutation } = saveHandApi;
export default saveHandApi;
