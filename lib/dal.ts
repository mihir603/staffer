import { db } from '@/db'
import { getSession } from './auth'
import { eq } from 'drizzle-orm'
import {users, employees} from '@/db/schema'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
import { cache } from 'react'
import { mockDelay } from './utils'

export const getCurrentUser = cache(async() => {
  console.log('get current user');
  
  const session = await getSession()
  if(!session){
    return null
  }
  try{
    const results = await db.select()
                            .from(users)
                            .where(eq(users.id, session.userId))
    return results[0] || null

  }catch(err){
    console.error(err)
    return null
  }
})

export const getUserByEmail = async(email: string) =>{
  try{
    const user = await db.query.users
      .findFirst({where: eq(users.email, email)})
    return user 
  }catch(err){
    console.error(err)
    return null
  }
}


export async function getEmployees() {
  'use cache'
  cacheTag('employees')
  try {
    const result = await db.query.employees.findMany({
      orderBy: (employees, { desc }) => [desc(employees.createdAt)],
    })
    mockDelay(1000)
    return result
    
  } catch (error) {
    console.error('Error fetching issues:', error)
    throw new Error('Failed to fetch issues')
  }
}

export const getEmployee = async(id: number) =>{
  try{
      const employee = await db.query.employees.findFirst({where: eq(employees.id, id)})
      return employee
  }catch(err){
    console.error(err)
    return null
  }
}