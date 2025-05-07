"use server";

import { redirect } from "next/navigation";

export async function handleRegister(formData: FormData) {
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const password = formData.get("password");

  if (!firstName || !lastName || !email || !password) {
    throw new Error("Todos los campos son obligatorios.");
  }

  const newUser = {
    firstName,
    lastName,
    email,
    password,
  };

  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_USER + "/register", {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log("Registro exitoso. Redirigiendo...");
      redirect("/home"); // o a /login si querés que inicie sesión después
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error en el registro");
    }
  } catch (error) {
    throw error;
  }
}
