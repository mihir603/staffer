import { getCurrentUser } from "@/lib/dal"
import EmployeeForm from "./EmployeeForm"
import { redirect } from "next/navigation"

const NewEmployee = async () => {
  const user = await getCurrentUser()
  if(!user) redirect('/signin')
  return <EmployeeForm userId={user.id}/>
}

export default NewEmployee
