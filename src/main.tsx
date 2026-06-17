import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App"

const savedTheme = window.localStorage.getItem("atrifex-theme")
const initialTheme = savedTheme === "light" ? "light" : "dark"

document.documentElement.classList.toggle("dark", initialTheme === "dark")
document.documentElement.classList.toggle("light", initialTheme === "light")

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
