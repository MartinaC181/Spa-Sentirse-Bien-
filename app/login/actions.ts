"use server";

import { redirect } from "next/navigation";

export async function handleLogin(formData: FormData) {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString().trim();

  console.log("Datos que recibe del formulario", { email, password });

  if (!email || !password) {
    throw new Error("Ambos campos son obligatorios lpm.");
  }

  const user = { email, password };

  try {
    const request = await fetch(process.env.NEXT_PUBLIC_API_USER + "/login", {
      body: JSON.stringify(user),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("respuesta de la API:", request);

    if (request.ok) {
      console.log("Login exitoso. Redirigiendo...");
      redirect("/home");
    } else {
      const errorResponse = await request.json();
      console.error("Error en la API:", errorResponse);
      throw new Error(errorResponse.message || "Error en el login");
    }
  } catch (error) {
    console.error("Error en handleLogin:", error);
    throw error;
  }
}