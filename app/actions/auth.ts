'use server'

import { z } from 'zod'
import {
  verifyPassword,
  createSession,
  createUser,
  deleteSession,
} from '@/lib/auth'
import { getUserByEmail } from '@/lib/dal'
import { mockDelay } from '@/lib/utils'
import { redirect } from 'next/navigation'

// Define Zod schema for signin validation
const SignInSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
})

// Define Zod schema for signup validation
const SignUpSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type SignInData = z.infer<typeof SignInSchema>
export type SignUpData = z.infer<typeof SignUpSchema>

export type ActionResponse = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
  error?: string
}
export const signIn = async(formData: FormData) : 
  Promise<ActionResponse> => {

    try{

      const data = {
    email: formData.get('email'),
    password: formData.get('password')
  }

  const validationResult = SignInSchema.safeParse(data)
  if(!validationResult.success){
    return {
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      }
  }

  const user = await getUserByEmail(data.email)
  if (!user) {
      return {
        success: false,
        message: 'Invalid email or password',
        errors: {
          email: ['Invalid email or password'],
        },
      }
  }

  const passwordValid = await verifyPassword(data.password, user.password)
  if(!passwordValid){
    return {
        success: false,
        message: 'Invalid email or password',
        errors: {
          password: ['Invalid email or password'],
        },
      }
  }

    await createSession(user.id)
    return {
      success: true,
      message: 'Signed In Successfully'
    }

    }catch(err){
      console.error(err)

      return {
      success: false,
      error: 'Something bad happened',
      message: 'Something bad happened'
    }
    }
  
  
}

export const signUp = async(formData: FormData) : Promise<ActionResponse> =>{
  await mockDelay(700)
  try{

    const data = {
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword')
  }

  const validationResult = SignUpSchema.safeParse(data)

  if(!validationResult.success){
    return {
      success: false,
      message: 'Validation Failed',
      errors: validationResult.error.flatten().fieldErrors,
    }
  }


  const existingUser = await getUserByEmail(data.email)
  if(existingUser){
    return {
      success: false,
      message: 'Nah',
      errors: {
        message: ['Stop Trying to Spoof !']
      },
    }
  }

  const user = await createUser(data.email, data.password)
  if(!user){
    return {
      success: false,
      message: 'Error, Try again',
      errors: {
        message: ['Account could not be created !']
      },
    }
  }
  await createSession(user.id)

  return {
      success: true,
      message: 'Account created successfully',
    }

  }catch(err){
      console.error('Sign up error:', err)
    return {
      success: false,
      message: 'An error occurred while creating your account',
      error: 'Failed to create account',
    }
  }

}

export const signOut = async() =>{
  try{
   await deleteSession()
  }catch(err){
    console.error(err)
    throw err
  } finally{
    redirect("/signin")
  }
}