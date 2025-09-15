import { Geist, Geist_Mono } from "next/font/google";
import "./global.css"; // <- relativo, singular, minúsculo

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "8-Puzzle Solver",
  description: "A* e Greedy com heurísticas Manhattan/Misplaced",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
