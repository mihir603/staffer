'use client'
import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Employee, EMPLOYEE_STATUS} from '@/db/schema'
import Button from './ui/Button'
import {
  Form,
  FormGroup,
  FormLabel,
  FormInput,
  FormTextarea,
  FormSelect,
  FormError,
  FormDatePicker,
} from './ui/Form'
import { createEmployee, ActionResponse, updateEmployee } from '@/app/actions/employees'

interface IssueFormProps {
  employee?: Employee
  userId?: string
  isEditing?: boolean
}

const initialState: ActionResponse = {
  success: false,
  message: '',
  errors: undefined,
}


export default function EmployeeForm({
  employee,
  userId,
  isEditing = false,
}: IssueFormProps) {
  const router = useRouter()

  // Use useActionState hook for the form submission action
  const [state, formAction, isPending] = useActionState<
    ActionResponse,
    FormData
  >(async (prevState: ActionResponse, formData: FormData) => {
    // Extract data from form
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      designation: formData.get('desg') as string,
      address: formData.get('address') as string,
      salary:  parseFloat(formData.get('salary') as string),
      phone: formData.get('phoneNo') as string,
      dateOfJoining: new Date(formData.get('dateOfJoining') as string),
      status: formData.get('status') as
        | 'active'
        | 'inactive'
        | 'retired'
        | 'terminated'
    }

    try {
      // Call the appropriate action based on whether we're editing or creating
      const result = isEditing
        ? await updateEmployee(Number(employee!.id), data)
        : await createEmployee(data)
      
      // Handle successful submission
      if (result.success) {
        if (!isEditing) {
          router.push('/dashboard')
          router.refresh()
        }
      }

      return result
    } catch (err) {
      return {
        success: false,
        message: (err as Error).message || 'An error occurred',
        errors: undefined,
      }
    }
  }, initialState)

  const statusOptions = Object.values(EMPLOYEE_STATUS).map(({ label, value }) => ({
    label,
    value,
  }))
  return (
    <Form action={formAction}>
      {state?.message && (
        <FormError
          className={`mb-4 ${
            state.success ? 'bg-green-100 text-green-800 border-green-300' : ''
          }`}
        >
          {state.message}
        </FormError>
      )}

      <FormGroup>
        <FormLabel htmlFor="firstName">First Name</FormLabel>
        <FormInput
          id="firstName"
          name="firstName"
          placeholder="First Name"
          defaultValue={employee?.firstName || ''}
          required
          minLength={3}
          maxLength={100}
          disabled={isPending}
          aria-describedby="title-error"
          className={state?.errors?.title ? 'border-red-500' : ''}
        />
        {state?.errors?.title && (
          <p id="title-error" className="text-sm text-red-500">
            {state.errors.title[0]}
          </p>
        )}
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="lastName">Last Name</FormLabel>
        <FormInput
          id="lastName"
          name="lastName"
          placeholder="Last Name"
          defaultValue={employee?.lastName || ''}
          required
          minLength={3}
          maxLength={100}
          disabled={isPending}
          aria-describedby="title-error"
          className={state?.errors?.title ? 'border-red-500' : ''}
        />
        {state?.errors?.title && (
          <p id="title-error" className="text-sm text-red-500">
            {state.errors.title[0]}
          </p>
        )}
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="desg">Designation</FormLabel>
        <FormInput
          id="desg"
          name="desg"
          placeholder="Designation"
          defaultValue={employee?.designation || ''}
          required
          minLength={3}
          maxLength={100}
          disabled={isPending}
          aria-describedby="title-error"
          className={state?.errors?.title ? 'border-red-500' : ''}
        />
        {state?.errors?.title && (
          <p id="title-error" className="text-sm text-red-500">
            {state.errors.title[0]}
          </p>
        )}
      </FormGroup>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormGroup>
        <FormLabel htmlFor="salary">Salary</FormLabel>
        <FormInput
          id="salary"
          name="salary"
          placeholder="Salary"
          defaultValue={employee?.salary || ''}
          required
          minLength={3}
          maxLength={100}
          disabled={isPending}
          aria-describedby="title-error"
          className={state?.errors?.title ? 'border-red-500' : ''}
        />
        {state?.errors?.title && (
          <p id="title-error" className="text-sm text-red-500">
            {state.errors.title[0]}
          </p>
        )}
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="phoneNo">Phone No.</FormLabel>
        <FormInput
          id="phoneNo"
          name="phoneNo"
          placeholder="Phone No."
          defaultValue={employee?.phone || ''}
          disabled={isPending}
          aria-describedby="title-error"
          className={state?.errors?.title ? 'border-red-500' : ''}
        />
        {state?.errors?.title && (
          <p id="title-error" className="text-sm text-red-500">
            {state.errors.title[0]}
          </p>
        )}
      </FormGroup>
</div>
      
      

      <FormGroup>
        <FormLabel htmlFor="address">Address</FormLabel>
        <FormTextarea
          id="address"
          name="address"
          placeholder="Write Down address..."
          rows={4}
          defaultValue={employee?.address || ''}
          disabled={isPending}
          aria-describedby="addres-error"
          className={state?.errors?.description ? 'border-red-500' : ''}
        />
        {state?.errors?.address && (
          <p id="address-error" className="text-sm text-red-500">
            {state.errors.description[0]}
          </p>
        )}
      </FormGroup>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Date of Joining */}
  <FormGroup>
    <FormLabel htmlFor="dateOfJoining">Date Of Joining</FormLabel>
    <FormDatePicker
      id="dateOfJoining"
      name="dateOfJoining"
      disabled={isPending}
      defaultValue={
       employee?.dateOfJoining as string
      }
      required
      aria-describedby="dateOfJoining-error"
      className={state?.errors?.dateOfJoining ? 'border-red-500' : ''}
    />
    {state?.errors?.dateOfJoining && (
      <p id="dateOfJoining-error" className="text-sm text-red-500">
        {state.errors.dateOfJoining[0]}
      </p>
    )}
  </FormGroup>

  {/* Status */}
  <FormGroup>
    <FormLabel htmlFor="status">Status</FormLabel>
    <FormSelect
      id="status"
      name="status"
      defaultValue={employee?.status || 'active'}
      options={statusOptions}
      disabled={isPending}
      required
      aria-describedby="status-error"
      className={state?.errors?.status ? 'border-red-500' : ''}
    />
    {state?.errors?.status && (
      <p id="status-error" className="text-sm text-red-500">
        {state.errors.status[0]}
      </p>
    )}
  </FormGroup>
</div>


      <div className="flex justify-end gap-2 mt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isPending}>
          {isEditing ? 'Update Employee' : 'Create Employee'}
        </Button>
      </div>
    </Form>
  )
}
