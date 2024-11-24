import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { parseNumber } from '../utils/dataUtils';
import { SortedData } from './types/types';

type DataResponse = string[];

const samogonApi = createApi({
  reducerPath: 'samogonApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://craftstore.com.ua/data/samogon/',
    responseHandler: 'text',
  }),
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    getData: builder.query<SortedData, string>({
      query: (key) => ({
        url: 'read_data.php',
        method: 'POST',
        body: new URLSearchParams({ key }),
      }),
      transformResponse: (response: string): SortedData => {
        const data: DataResponse = response
          .trim()
          .split('\n')
          .filter((item: string) => item);

        return {
          tempCube: parseNumber(data[0]),
          tempCargi: parseNumber(data[1]),
          tempDef: parseNumber(data[2]),
          tempWoter: parseNumber(data[3]),
          handWork: parseNumber(data[11]),
          errorHand: parseNumber(data[15]),
          handPower: parseNumber(data[36]),
          handPercent: parseNumber(data[37]),
          handTempSelect: parseNumber(data[38]),
          handTempGyst: parseNumber(data[39]),
          handWoterError: parseNumber(data[40]),
          handTempWoterError: parseNumber(data[41]),
          handLevelError: parseNumber(data[42]),
          handTempCubeError: parseNumber(data[43]),
          version: parseNumber(data[93]),
          handTen: parseNumber(data[95]),
          handK1: parseNumber(data[96]),
          handK2: parseNumber(data[97]),
          handK3: parseNumber(data[98]),
          handPin1: parseNumber(data[101]),
          handPin2: parseNumber(data[102]),
          selection: parseNumber(data[109]),
          selectionSpeed: parseNumber(data[110]),
          handSpeedTail: parseNumber(data[113]),
          handK4: parseNumber(data[114]),
          switchBody: parseNumber(data[121]),
        };
      },
    }),
  }),
});

export const { useGetDataQuery } = samogonApi;
export default samogonApi;
