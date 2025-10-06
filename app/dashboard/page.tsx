import { getEmployees } from "@/lib/dal"
import Link from 'next/link'
import Button from '../components/ui/Button'
import { PlusIcon } from 'lucide-react'
import Badge from '../components/ui/Badge'
import { formatRelativeTime } from '@/lib/utils'
import { Status } from "@/lib/types"
import { EMPLOYEE_STATUS } from "@/db/schema"
import CreatedAtCalculate from "../components/CreatedAtCalculate"
import { Suspense } from "react"
const DashboardPage = async() =>{

  const employees = await getEmployees()
  
  return (
     <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Employees</h1>
        <Link href="/employees/new">
          <Button>
            <span className="flex items-center">
              <PlusIcon size={18} className="mr-2" />
              New Employee
            </span>
          </Button>
        </Link>
      </div>

      {employees.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-dark-border-default bg-white dark:bg-dark-high shadow-sm">
          {/* Header row */}
          <div className="grid grid-cols-12 gap-5 px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-dark-elevated border-b border-gray-200 dark:border-dark-border-default">
            <div className="col-span-3">First Name</div>
            <div className="col-span-2">Last Name</div>
            <div className="col-span-2">Designation</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Created</div>
          </div>

          {/* Issue rows */}
          <div className="divide-y divide-gray-200 dark:divide-dark-border-default">
            {employees.map((employee) => (
              <Link
                key={employee.id}
                href={`/employees/${employee.id}`}
                className="block hover:bg-gray-50 dark:hover:bg-dark-elevated transition-colors"
              >
                <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                  <div className="col-span-3 font-medium truncate">
                    {employee.firstName}
                  </div>
                  <div className="col-span-2 font-medium truncate">
                    {employee.lastName}
                  </div>
                  <div className="col-span-2 font-medium truncate">
                    {employee.designation}
                  </div>
                  <div className="col-span-2">
                    <Badge status={employee.status as Status}>
                      {EMPLOYEE_STATUS[employee.status as Status].label}
                    </Badge>
                  </div>
                  <Suspense fallback={"Getting Timestamp..."}>
                    <CreatedAtCalculate date={employee.createdAt}/>
                  </Suspense>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center border border-gray-200 dark:border-dark-border-default rounded-lg bg-white dark:bg-dark-high p-8">
          <h3 className="text-lg font-medium mb-2">No employees found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Get started by creating your first employee.
          </p>
          <Link href="/employees/new">
            <Button>
              <span className="flex items-center">
                <PlusIcon size={18} className="mr-2" />
                Add Employee
              </span>
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default DashboardPage