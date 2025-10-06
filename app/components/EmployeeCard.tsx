import { Employee } from '@/db/schema'
import { formatRelativeTime } from '@/lib/utils'
import {Status } from '@/lib/types'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/Card'
import Badge from './ui/Badge'

interface EmployeeCardProps {
  employee: Employee
}

export default function EmployeeCard({ employee }: EmployeeCardProps) {
  const { id, firstName, lastName, designation, salary, status, phone, address, createdAt } = employee

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'inactive':
        return 'In-Active'
      case 'retired':
        return 'Retired'
      case 'terminated':
        return 'Terminated'
      default:
        return status
    }
  }

  return (
    <Link href={`/employees/${id}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <CardTitle className="line-clamp-1 text-base">{firstName} {lastName}</CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          {address && (
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
              {address}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Badge status={status as Status}>{getStatusLabel(status)}</Badge>
          </div>
        </CardContent>
        <CardFooter className="text-xs text-gray-500">
          {formatRelativeTime(new Date(createdAt))}
        </CardFooter>
      </Card>
    </Link>
  )
}
