import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const deleteRoomApi = createApi({
  reducerPath: 'deleteRoomApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://craftstore.com.ua/data/',
    responseHandler: 'text',
  }),
  endpoints: (builder) => ({
    deleteRoom: builder.mutation<any, { machineNumber: string; key: string }>({
      query: ({ machineNumber, key }) => ({
        url: 'delete_block.php',
        method: 'POST',
        body: new URLSearchParams({
          key: machineNumber,
          b: key,
        }),
      }),
    }),
  }),
});

export const { useDeleteRoomMutation } = deleteRoomApi;
export default deleteRoomApi;
