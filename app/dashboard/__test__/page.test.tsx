import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import DashboardPage from '../page'
import { getEmployee, getEmployees } from '@/lib/dal'
import { EMPLOYEE_STATUS } from '@/db/schema'

// Mock the dependencies
vi.mock('@/lib/dal', () => ({
  getEmployees: vi.fn(),
  getCurrentUser: vi.fn(),
}))

// Mock Next.js components
vi.mock('next/link', () => ({
  default: ({
    href,
    children,
  }: {
    href: string
    children: React.ReactNode
  }) => (
    <a href={href} data-testid="next-link">
      {children}
    </a>
  ),
}))
// Mock the formatRelativeTime function
vi.mock('@/lib/utils', () => ({
  formatRelativeTime: vi.fn(() => '2 days ago'),
  cn: vi.fn((...args) => args.join(' ')),
}))

describe('Dashboard', () =>{
  beforeEach(() =>{
    vi.clearAllMocks()
  })

  it('it renders the employees when they are available', async() =>{
    const mockEmployees = [
    { id: 1,
      firstName: 'Test Name 1',
      lastName: 'Test Surname 2',
      designation: 'DESG 1',
      salary: 85000,
      dateOfJoining: '2021-02-10',
      phone: 9876543210,
      status: 'active',
      address: 'some address 1'
  },
  {
    id: 2,
    firstName: 'Test Name 2',
    lastName: 'Test Surname 2',
    designation: 'DESG 2',
    salary: 95000,
    dateOfJoining: '2019-08-20',
    phone: 9823456789,
    status: 'inactive',
    address: 'some address 2'
  },
     
    ]

    vi.mocked(getEmployees).mockResolvedValueOnce(mockEmployees)

    // Render the component (await it since it's an RSC)
    render(await DashboardPage())
    expect(screen.getByText('Test Name 1')).toBeInTheDocument()
    expect(screen.getByText('Test Name 2')).toBeInTheDocument()
    expect(screen.getByText(EMPLOYEE_STATUS.active.label)).toBeInTheDocument()
     expect(screen.getByText(EMPLOYEE_STATUS.inactive.label)).toBeInTheDocument()
    expect(screen.getAllByText('2 days ago')).toHaveLength(2)
  })

})
