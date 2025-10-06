import {InferSelectModel } from "drizzle-orm";
import {text, decimal, date, numeric, pgEnum, serial ,timestamp, pgTable } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum('status', [
  'active',
  'inactive',
  'terminated',
  'retired'
]);

export const employees = pgTable('emp_data', {
  id: serial('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  designation: text('desg').notNull(),
  salary: decimal('salary').notNull(),
  dateOfJoining: date('date_of_joining').notNull(),
  phone: numeric('phone'),
  address: text('address'),
  status: statusEnum('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});


export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export type Employee = InferSelectModel<typeof employees>
export type User = InferSelectModel<typeof users> 


export const EMPLOYEE_STATUS = {
  active: {'label': 'Active', 'value': 'active'},
  inactive: {'label' : 'In-Active', 'value' : 'inactive'},
  terminated: {'label' : 'Terminated', 'value' : 'terminated'},
  retired: {'label' : 'Retired', 'value' : 'retired'}
}