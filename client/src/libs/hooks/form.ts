import { useState, ChangeEvent } from 'react'

export type HTMLInputChangeEvent = ChangeEvent<HTMLInputElement>

export function useFormFields<T>(
  initialState: T
): [T, (event: HTMLInputChangeEvent) => void] {
  const [fields, setValues] = useState(initialState)

  return [
    fields,
    function (event: HTMLInputChangeEvent) {
      setValues({
        ...fields,
        [event.target.id]: event.target.value,
      })
    },
  ]
}
