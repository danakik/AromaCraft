import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const changeNameApi = createApi({
    reducerPath: 'changeNameApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'https://craftstore.com.ua/data/',
        responseHandler: 'text'
     }),
    endpoints: (builder) => ({
        changeName: builder.mutation({
            query: ({ key, c, n }) => ({
                url: 'change_block.php',
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ 
                    key, 
                    c: c, 
                    n: n
                }),
            }),
        }),
    }),
});

export const { useChangeNameMutation } = changeNameApi;
export default changeNameApi;
