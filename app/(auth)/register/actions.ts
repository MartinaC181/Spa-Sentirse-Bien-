"use server";

import { redirect } from "next/navigation";

export async function handleRegister(formData: FormData) {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  console.log(firstName, lastName, email, password);
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_USER! + '/register', {
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

    if (response.ok) {
      console.log("Registro exitoso. Redirigiendo...");
      redirect("/");
    } else {
      const errorResponse = await response.json();
      console.error("Error en la API:", errorResponse);
      throw new Error(errorResponse.message || "Error en el registro");
    }
  
  } catch (error) {
    console.error("Error en handleLogin:", error);
    throw error;
  }
}
