'use server'
import { db } from '@/db'
import { employees } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { getCurrentUser } from '@/lib/dal'
import { z } from 'zod'
import { mockDelay } from '@/lib/utils'
import { revalidateTag } from 'next/cache'

// Define Zod schema for issue validation
const EmployeeSchema = z.object({
  firstName: z
    .string()
    .min(3, 'First Name is required')
    .max(100, 'First Name must be less than 100 characters'),
  
  lastName: z
    .string()
    .min(3, 'Last Name is required')
    .max(100, 'Last Name must be less than 100 characters'),

  dateOfJoining: z
        .date(),
  
  salary: z
          .number()
          .min(4, 'Salary must be greater than 2 digits'),
        
  address: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  designation: z
          .string()
          .min(1, 'Designation is required'),
  status: z.enum(['active', 'inactive', 'terminated', 'retired'], {
    errorMap: () => ({ message: 'Please select a valid status' }),
  }),
})

export type EmployeeData = z.infer<typeof EmployeeSchema>

export type ActionResponse = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
  error?: string
}

export const createEmployee = async(data: EmployeeData) =>{
  try {
    // Security check - ensure user is authenticated
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        message: 'Unauthorized access',
        error: 'Unauthorized',
      }
    }

    // Validate with Zod
    const validationResult = EmployeeSchema.safeParse(data)
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    // Create issue with validated data
    const validatedData = validationResult.data

    await db.insert(employees).values({
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      designation: validatedData.designation,
      salary: validatedData.salary,
      dateOfJoining: validatedData.dateOfJoining,
      phone: validatedData.phone || null,
      address: validatedData.address || null,
      status: validatedData.status,
    })
    revalidateTag('employees')
    return { success: true, message: 'Issue created successfully' }
  } catch (error) {
    console.error('Error creating issue:', error)
    return {
      success: false,
      message: 'An error occurred while creating the issue',
      error: 'Failed to create issue',
    }
  }
}


export const updateEmployee = async(id: number, data: Partial<EmployeeData>): Promise<ActionResponse> => {
  try{

    const user = await getCurrentUser()
  if(!user){
    return{
      success: false,
      message: 'Unauthorized access',
      error: 'Authorized'
    }
  }

  const UpdateSchema = EmployeeSchema.partial()
  const validationResult = UpdateSchema.safeParse(data)
  if(!validationResult.success){
return{
      success: false,
      message: 'Invalid Employee',
      errors: validationResult.error.flatten().fieldErrors
    }
  }


      // Type safe update object with validated data
    const validatedData = validationResult.data
    const updateData: Record<string, unknown> = {}

    if (validatedData.firstName !== undefined)
      updateData.firstName = validatedData.firstName
    if (validatedData.lastName !== undefined)
      updateData.lastName = validatedData.lastName
    if (validatedData.status !== undefined)
      updateData.status = validatedData.status
    if (validatedData.address !== undefined)
      updateData.address = validatedData.address
    if (validatedData.designation !== undefined)
      updateData.designation = validatedData.designation
    if (validatedData.dateOfJoining !== undefined)
      updateData.dateOfJoining = validatedData.dateOfJoining
    if (validatedData.salary !== undefined)
      updateData.salary = validatedData.salary
    if (validatedData.phone !== undefined)
      updateData.phone = validatedData.phone
   
    // update issue
    await db.update(employees).set(updateData).where(eq(employees.id, id))

    return {success: true, message: 'Employee updated successfully !'}

  }catch(err){
    console.error('Error in updating employee: '+err)
    return {
      success: false,
      message: 'An error occurred while updating the employee',
      error: 'Failed to update employee',
    }
  }
  
}

export async function deleteEmployee(id: number) {
  try {
    // Security check - ensure user is authenticated
    await mockDelay(700)
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Unauthorized')
    }

    // Delete issue
    await db.delete(employees).where(eq(employees.id, id))
    revalidateTag('employees')
    return { success: true, message: 'Employee deleted successfully' }
  } catch (error) {
    console.error('Error deleting employee:', error)
    return {
      success: false,
      message: 'An error occurred while deleting the issue',
      error: 'Failed to delete issue',
    }
  }
}