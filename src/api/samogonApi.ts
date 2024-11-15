import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import sortedData from './sortedData';

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

                sortedData.tempCube = dataArray[0]; // 0: 'temp cube'
                sortedData.tempCargi = dataArray[1]; // 1: 'temp cargi'
                sortedData.tempDef = dataArray[2]; // 2: 'temp def'
                sortedData.tempWoter = dataArray[3]; // 3: 'temp woter'
                sortedData.handWork = dataArray[11]; // 11: 'hand work'
                sortedData.errorHand = dataArray[15]; // 15: 'error hand'
                sortedData.handPower = dataArray[36]; // 36: 'hand power'
                sortedData.handPercent = dataArray[37]; // 37: 'hand percent'
                sortedData.handTempSelect = dataArray[38]; // 38: 'hand temp select'
                sortedData.handTempGyst = dataArray[39]; // 39: 'hand temp gyst'
                sortedData.handWoterError = dataArray[40]; // 40: 'hand woter error'
                sortedData.handTempWoterError = dataArray[41]; // 41: 'hand temp woter error'
                sortedData.handLevelError = dataArray[42]; // 42: 'hand level error'
                sortedData.handTempCubeError = dataArray[43]; // 43: 'hand temp cube error'
                sortedData.version = dataArray[93]; // 93: 'version'
                sortedData.handTen = dataArray[95]; // 95: 'hand ten'
                sortedData.handK1 = dataArray[96]; // 96: 'hand k1'
                sortedData.handK2 = dataArray[97]; // 97: 'hand k2'
                sortedData.handK3 = dataArray[98]; // 98: 'hand k3'
                sortedData.handPin1 = dataArray[101]; // 101: 'hand pin'
                sortedData.handPin2 = dataArray[102]; // 102: 'hand pin'
                sortedData.selection = dataArray[109]; // 109: 'selection'
                sortedData.selectionSpeed = dataArray[110]; // 110: 'selection speed'
                sortedData.handSpeedTail = dataArray[113]; // 113: 'hand speed tail'
                sortedData.handK4 = dataArray[114]; // 114: 'hand k4'
                sortedData.switchBody = dataArray[121]; // 121: 'switch body'

                return dataArray
            },
        }),
    }),
})

export const { useGetDataQuery } = samogonApi
export default samogonApi
