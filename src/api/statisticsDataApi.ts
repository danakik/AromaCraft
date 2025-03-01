import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const statisticsDataApi = createApi({
  reducerPath: 'statisticsDataApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://craftstore.com.ua/data/samogon/',
  }),
  endpoints: (builder) => ({
    statisticsData: builder.query({
      query: (key) => `json.php?key=${key}`,
    }),
  }),
});

export const { useStatisticsDataQuery } = statisticsDataApi;
export default statisticsDataApi;
