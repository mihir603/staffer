'use client'
import { formatRelativeTime } from "@/lib/utils"

const CreatedAtCalculate = ({date} : {date: Date}) =>{
  return(
    <div className="col-span-3 text-sm text-gray-500 dark:text-gray-400">
                    {formatRelativeTime(new Date(date))}
                  </div>
  )
}

export default CreatedAtCalculate