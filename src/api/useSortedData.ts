import { useEffect, useState } from 'react';
import { useGetDataQuery } from './samogonApi';

interface SortedData {
  tempCube: number;
  tempCargi: number;
  tempDef: number;
  tempWoter: number;
  handWork: number;
  errorHand: number;
  handPower: number;
  handPercent: number;
  handTempSelect: number;
  handTempGyst: number;
  handWoterError: number;
  handTempWoterError: number;
  handLevelError: number;
  handTempCubeError: number;
  version: number;
  handTen: number;
  handK1: number;
  handK2: number;
  handK3: number;
  handPin1: number;
  handPin2: number;
  selection: number;
  selectionSpeed: number;
  handSpeedTail: number;
  handK4: number;
  switchBody: number;
}

const initialSortedData: SortedData = {
  tempCube: 0,
  tempCargi: 0,
  tempDef: 0,
  tempWoter: 0,
  handWork: 0,
  errorHand: 0,
  handPower: 0,
  handPercent: 0,
  handTempSelect: 0,
  handTempGyst: 0,
  handWoterError: 0,
  handTempWoterError: 0,
  handLevelError: 0,
  handTempCubeError: 0,
  version: 0,
  handTen: 0,
  handK1: 0,
  handK2: 0,
  handK3: 0,
  handPin1: 0,
  handPin2: 0,
  selection: 0,
  selectionSpeed: 0,
  handSpeedTail: 0,
  handK4: 0,
  switchBody: 0,
};

const useSortedData = (key: string | null) => {
  const { data, error, isLoading, refetch } = useGetDataQuery(key!, {
    skip: !key,
  });
  const [sortedData, setSortedData] = useState<SortedData>(initialSortedData);

  useEffect(() => {
    if (data) {
      updateSortedData(data);
    }
  }, [data]);

  const parseNumber = (value: any): number => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  const updateSortedData = (newData: any) => {
    const newSortedData: SortedData = {
      tempCube: parseNumber(newData[0]),
      tempCargi: parseNumber(newData[1]),
      tempDef: parseNumber(newData[2]),
      tempWoter: parseNumber(newData[3]),
      handWork: parseNumber(newData[11]),
      errorHand: parseNumber(newData[15]),
      handPower: parseNumber(newData[36]),
      handPercent: parseNumber(newData[37]),
      handTempSelect: parseNumber(newData[38]),
      handTempGyst: parseNumber(newData[39]),
      handWoterError: parseNumber(newData[40]),
      handTempWoterError: parseNumber(newData[41]),
      handLevelError: parseNumber(newData[42]),
      handTempCubeError: parseNumber(newData[43]),
      version: parseNumber(newData[93]),
      handTen: parseNumber(newData[95]),
      handK1: parseNumber(newData[96]),
      handK2: parseNumber(newData[97]),
      handK3: parseNumber(newData[98]),
      handPin1: parseNumber(newData[101]),
      handPin2: parseNumber(newData[102]),
      selection: parseNumber(newData[109]),
      selectionSpeed: parseNumber(newData[110]),
      handSpeedTail: parseNumber(newData[113]),
      handK4: parseNumber(newData[114]),
      switchBody: parseNumber(newData[121]),
    };

    setSortedData(newSortedData);
  };

  return { sortedData, error, isLoading, refetch };
};

export default useSortedData;
