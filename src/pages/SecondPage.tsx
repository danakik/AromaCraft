import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'primereact/button'
import { useGetDataQuery } from '../api/samogonApi'

const SecondPage = () => {
    const key = '20222222222222'

    const { data, error, isLoading, refetch } = useGetDataQuery(key)

    const indexMap: Record<number, string> = {
        0: 'temp cube',
        1: 'temp cargi',
        2: 'temp def',
        3: 'temp woter',
        11: 'hand work',
        15: 'error hand',
        36: 'hand power',
        37: 'hand percent',
        38: 'hand temp select',
        39: 'hand temp gyst',
        40: 'hand woter error',
        41: 'hand temp woter error',
        42: 'hand level error',
        43: 'hand temp cube error',
        93: 'version',
        95: 'hand ten',
        96: 'hand k1',
        97: 'hand k2',
        98: 'hand k3',
        101: 'hand pin',
        102: 'hand pin',
        109: 'selection',
        110: 'selection speed',
        113: 'hand speed tail',
        114: 'hand k4',
        121: 'switch body',
    }

    const filteredData = data
        ?.map((item, index) => {
            if (indexMap.hasOwnProperty(index)) {
                return { name: indexMap[index], value: item }
            }
            return null
        })
        .filter((item) => item !== null)

    console.log('Filtered Data:', filteredData)

    useEffect(() => {
        const intervalId = setInterval(() => {
            refetch()
        }, 15000)

        return () => clearInterval(intervalId)
    }, [refetch])

    return (
        <div>
            <Link to="/main">
                <Button label="Go to Main Page" icon="pi pi-arrow-right" />
            </Link>
            <h2> Data from API</h2>

            {isLoading && <div>Loading...</div>}
            {error && <div>{'status' in error ? `Error occurred: ${error.status}` : 'Unknown error occurred'}</div>}

            {filteredData && filteredData.length > 0 && (
                <ul>
                    {filteredData.map((item, index) => (
                        <li key={index}>
                            {item.name}: {item.value}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default SecondPage
