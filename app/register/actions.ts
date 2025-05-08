"use server";

import { redirect } from "next/navigation";

export async function handleRegister(formData: FormData) {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  console.log(firstName, lastName, email, password);
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_USER + '/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al registrar usuario');
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Error al registrar usuario');
  }
}
