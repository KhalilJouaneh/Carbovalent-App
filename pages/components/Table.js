import useSWR from 'swr'
import { useState } from 'react';
import {Loading} from './Loading'



export function Table() {

    const [pageIndex, setPageIndex] = useState(0);

    const fetcher = async() => {
        const res = await fetch(`https://api.goldstandard.org/credits?query&size=25&page=${pageIndex}&issuances=true`);
        const data = await res.json();
        return data;
      }
    
      const {data,error} = useSWR(`https://api.goldstandard.org/credits?query&size=25&page=${pageIndex}&issuances=true`, fetcher)
    
    
      if (error) return "An error has occurred."

      {data ? (
          data.map((project, idx) => {
      return (
          <>
              <div className="overflow-x-none flex items-center justify-center">
                <table className="table-fixed max-w-screen-lg border-separate border border-slate-700 border-spacing-5d">
                      <thead>
                        <tr>
                          <th>name</th>
                          <th>country</th>
                          <th>carbon credits</th>
                          <th>type</th>
                          <th>vintage</th>
                          <th>serial number</th>
                        </tr>
                      </thead>
                      
                      <tbody>
                        <tr>
                          <td className='w-52 text-center'>{project.project.name}</td>
                          <td className='w-52 text-center'>{project.project.country}</td>
                          <td className='w-52 text-center'>{project.number_of_credits}</td>
                          <td className='w-52 text-center'>{project.project.type}</td>
                          <td className='w-52 text-center'>{project.vintage}</td>
                          <td className='w-52 text-center'>{project.serial_number}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
        </>
          )
        })
        ) : (
          <Loading />
        )}


}