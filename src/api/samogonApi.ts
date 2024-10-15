import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type DataResponse = string[] 

const samogonApi = createApi({
    reducerPath: 'samogonApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://craftstore.com.ua/data/samogon/',
        responseHandler: 'text',
    }),
    endpoints: (builder) => ({
        getData: builder.query<DataResponse, string>({
            query: (key) => ({
                url: 'read_data.php',
                method: 'POST',
                body: new URLSearchParams({ key }),
            }),
            transformResponse: (response: string): DataResponse => {
                console.log('Raw Response:', response)

                const dataArray: DataResponse = response
                    .trim()
                    .split('\n')
                    .filter((item: string) => item)
                console.log('Transformed Data:', dataArray)
                return dataArray
            },
        }),
    }),
})

export const { useGetDataQuery } = samogonApi
export default samogonApi
