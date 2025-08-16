import * as React from "react"
import { FormProvider, UseFormReturn, FieldValues } from "react-hook-form"

type FormProps<T extends FieldValues> = {
  children: React.ReactNode
} & UseFormReturn<T>

export function Form<T extends FieldValues>({ children, ...props }: FormProps<T>) {
  return <FormProvider {...props}>{children}</FormProvider>
}
