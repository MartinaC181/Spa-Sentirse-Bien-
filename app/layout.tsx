import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientAuthProvider from "@/components/ClientAuthProvider";
import Chatbot from "@/components/chatbot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spa Sentirse Bien",
  description: "Tu espacio de bienestar y relajación",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ClientAuthProvider>
          <Chatbot />
          {children}
        </ClientAuthProvider>
      </body>
    </html>
  );
}
