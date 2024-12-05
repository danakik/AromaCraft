import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const saveRoomApi = createApi({
  reducerPath: 'saveRoomApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://craftstore.com.ua/data/',
    responseHandler: 'text',
  }),
  endpoints: (builder) => ({
    saveRoom: builder.mutation<any, { machineNumber: string; key: string }>({
      query: ({ machineNumber, key }) => ({
        url: 'save_block.php',
        method: 'POST',
        body: new URLSearchParams({
          key: machineNumber,
          b: key,
        }),
      }),
    }),
  }),
});

export const { useSaveRoomMutation } = saveRoomApi;
export default saveRoomApi;
