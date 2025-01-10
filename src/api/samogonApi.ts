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
          tempWater: parseNumber(data[3]),
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

          distAcceleration: parseNumber(data[17]),
          distPower: parseNumber(data[18]),
          distTempPower: parseNumber(data[19]),
          distTempStop: parseNumber(data[20]),
          distTempError: parseNumber(data[21]),
          distPowerBody: parseNumber(data[124]),
          distTimeBody: parseNumber(data[125]),
          distCubeSwitch: parseNumber(data[134]),
          distCubeHead: parseNumber(data[135]),

          rectAcceleration: parseNumber(data[22]),
          rectPower: parseNumber(data[23]),
          rectPowerBody: parseNumber(data[115]),
          rectTempPower: parseNumber(data[24]),
          rectTempStop: parseNumber(data[25]),
          rectTempHead: parseNumber(data[26]),
          rectGystHead: parseNumber(data[27]),
          rectTempBody: parseNumber(data[28]),
          rectGystBody: parseNumber(data[29]),
          rectPercentHead: parseNumber(data[30]),
          rectPercentBody: parseNumber(data[31]),
          rectDecreaseTemp: parseNumber(data[103]),
          rectDecreaseSpeed: parseNumber(data[104]),
          rectTempError: parseNumber(data[32]),
          rectTimeStab: parseNumber(data[33]),
          rectCubeTail: parseNumber(data[117]),
          rectSpeedTail: parseNumber(data[118]),
          rectSpeedCarge: parseNumber(data[122]),
          rectDecreaseCycle: parseNumber(data[105]),
          rectCyclesNumber: parseNumber(data[34]),
          rectEndCycle: parseNumber(data[129]),
          rectPowerTail: parseNumber(data[131]),
          rectTimeBody: parseNumber(data[116]),
          rectSwitchTail: parseNumber(data[130]),
          rectSwitchCube: parseNumber(data[126]),
          rectSwitchCarge: parseNumber(data[127]),
          rectSelectCarge: parseNumber(data[128]),
          transitBody: parseNumber(data[111]),

          mashingPauses: parseNumber(data[47]),
          mashingHeat: parseNumber(data[48]),
          mashingHeatTemp: parseNumber(data[49]),
          mashingHeatPower: parseNumber(data[50]),
          mashingHeatTime: parseNumber(data[51]),
          mashingCool: parseNumber(data[52]), 
          mashingCoolTemp: parseNumber(data[53]), 
          mashingCoolGyst: parseNumber(data[54]),

          mashingTemp0: parseNumber(data[55]),
          mashingTemp1: parseNumber(data[56]),
          mashingTemp2: parseNumber(data[57]),
          mashingTemp3: parseNumber(data[58]),
          mashingTemp4: parseNumber(data[59]),
          mashingTemp5: parseNumber(data[60]),
          mashingTemp6: parseNumber(data[61]),
          mashingTemp7: parseNumber(data[62]),
          mashingTemp8: parseNumber(data[63]),
          mashingTemp9: parseNumber(data[64]),

          mashingGyst0: parseNumber(data[65]),
          mashingGyst1: parseNumber(data[66]),
          mashingGyst2: parseNumber(data[67]),
          mashingGyst3: parseNumber(data[68]),
          mashingGyst4: parseNumber(data[69]),
          mashingGyst5: parseNumber(data[70]),
          mashingGyst6: parseNumber(data[71]),
          mashingGyst7: parseNumber(data[72]),
          mashingGyst8: parseNumber(data[73]),
          mashingGyst9: parseNumber(data[74]),
    
          mashingTime0: parseNumber(data[75]),
          mashingTime1: parseNumber(data[76]),
          mashingTime2: parseNumber(data[77]),
          mashingTime3: parseNumber(data[78]),
          mashingTime4: parseNumber(data[79]),
          mashingTime5: parseNumber(data[80]),
          mashingTime6: parseNumber(data[81]),
          mashingTime7: parseNumber(data[82]),
          mashingTime8: parseNumber(data[83]),
          mashingTime9: parseNumber(data[84]),

        };
      },
    }),
  }),
});

export const { useGetDataQuery } = samogonApi;
export default samogonApi;
