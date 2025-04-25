import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const createRoomApi = createApi({
  reducerPath: 'createRoomApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://craftstore.com.ua/data/',
    responseHandler: 'text',
  }),
  endpoints: (builder) => ({
    createRoom: builder.mutation<any, { machineNumber: string; key: string }>({
      query: ({ machineNumber, key }) => ({
        url: 'read_block_client.php',
        method: 'POST',
        body: new URLSearchParams({
          key: machineNumber,
          b: key,
        }),
      }),
    }),
  }),
});

export const { useCreateRoomMutation } = createRoomApi;
export default createRoomApi;
