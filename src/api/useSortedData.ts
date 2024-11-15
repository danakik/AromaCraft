import { useEffect, useState } from 'react';
import { useGetDataQuery } from './samogonApi';

interface SortedData {
    tempCube: string;
    tempCargi: string;
    tempDef: string;
    tempWoter: string;
    handWork: string;
    errorHand: string;
    handPower: string;
    handPercent: string;
    handTempSelect: string;
    handTempGyst: string;
    handWoterError: string;
    handTempWoterError: string;
    handLevelError: string;
    handTempCubeError: string;
    version: string;
    handTen: string;
    handK1: string;
    handK2: string;
    handK3: string;
    handPin1: string;
    handPin2: string;
    selection: string;
    selectionSpeed: string;
    handSpeedTail: string;
    handK4: string;
    switchBody: string;
}

const initialSortedData: SortedData = {
    tempCube: '',
    tempCargi: '',
    tempDef: '',
    tempWoter: '',
    handWork: '',
    errorHand: '',
    handPower: '',
    handPercent: '',
    handTempSelect: '',
    handTempGyst: '',
    handWoterError: '',
    handTempWoterError: '',
    handLevelError: '',
    handTempCubeError: '',
    version: '',
    handTen: '',
    handK1: '',
    handK2: '',
    handK3: '',
    handPin1: '',
    handPin2: '',
    selection: '',
    selectionSpeed: '',
    handSpeedTail: '',
    handK4: '',
    switchBody: '',
};

const useSortedData = (key: string | null) => {
    const { data, error, isLoading, refetch } = useGetDataQuery(key!, {
        skip: !key, // Пропустить запрос, если ключ не установлен
    });
    const [sortedData, setSortedData] = useState<SortedData>(initialSortedData);

    useEffect(() => {
        if (data) {
            updateSortedData(data);
        }
    }, [data]);

    const updateSortedData = (newData: any) => {
        const newSortedData: SortedData = {
            tempCube: newData[0] || '',
            tempCargi: newData[1] || '',
            tempDef: newData[2] || '',
            tempWoter: newData[3] || '',
            handWork: newData[11] || '',
            errorHand: newData[15] || '',
            handPower: newData[36] || '',
            handPercent: newData[37] || '',
            handTempSelect: newData[38] || '',
            handTempGyst: newData[39] || '',
            handWoterError: newData[40] || '',
            handTempWoterError: newData[41] || '',
            handLevelError: newData[42] || '',
            handTempCubeError: newData[43] || '',
            version: newData[93] || '',
            handTen: newData[95] || '',
            handK1: newData[96] || '',
            handK2: newData[97] || '',
            handK3: newData[98] || '',
            handPin1: newData[101] || '',
            handPin2: newData[102] || '',
            selection: newData[109] || '',
            selectionSpeed: newData[110] || '',
            handSpeedTail: newData[113] || '',
            handK4: newData[114] || '',
            switchBody: newData[121] || '',
        };

        setSortedData(newSortedData);
    };

    return { sortedData, error, isLoading, refetch };
};

export default useSortedData;