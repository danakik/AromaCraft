import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type DataResponse = { key: string; name: string }[]; 

export const mainApi = createApi({
    reducerPath: 'mainApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://craftstore.com.ua/data/',
        responseHandler: 'text',
    }),
    endpoints: (builder) => ({
        getData: builder.query<DataResponse, string>({
            query: (key: string) => ({
                url: 'read_block.php',
                method: 'POST',
                body: new URLSearchParams({ key }),
            }),
            transformResponse: (response: string): DataResponse => {
                const items = response.trim().split('\n');

                const dataArray: { key: string; name: string }[] = [];

                for (let i = 0; i < items.length; i++) {
                    if (i % 2 === 0 && i != 0) {
                        dataArray.push({
                            key: items[i - 1],
                            name: items[i], 
                        });
                    }
                }

                return dataArray;
            },
        }),
    }),
});

export const { useGetDataQuery } = mainApi;
export default mainApi;