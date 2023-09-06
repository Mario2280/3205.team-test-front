import { object, string, number as num } from 'yup'
export interface User {
	email: string

	number: number
}

export const userSchema = object({
	email: string().email(),
	number: num().optional().positive(),
})
