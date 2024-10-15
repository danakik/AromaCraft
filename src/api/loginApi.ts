import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type LoginResponse = string; 

const loginApi = createApi({
    reducerPath: 'loginApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://craftstore.com.ua/data/', 
        responseHandler: 'text', 
    }),
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, string>({
            query: (key) => ({
                url: 'read_block_client.php', 
                method: 'POST',
                body: new URLSearchParams({ key }), 
            }),
        }),
    }),
});


export const { useLoginMutation } = loginApi;
export default loginApi;
