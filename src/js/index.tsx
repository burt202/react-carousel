import * as React from "react"
import {createRoot} from "react-dom/client"

import Carousel from "./carousel"

const colors = [
  "#f1c40f",
  "#f39c12",
  "#e74c3c",
  "#16a085",
  "#2980b9",
  "#8e44ad",
  "#2c3e50",
  "#95a5a6",
]

const colorsArray = colors.map((color) => (
  <div
    style={{
      background: color,
      borderRadius: "20px",
      opacity: 0.9,
      color: "white",
      fontSize: "2rem",
      width: "20rem",
      height: "20rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
    key={color}
  >
    {color}
  </div>
))

function App() {
  return (
    <div style={{width: "100%", background: "#ecf0f1", padding: 20}}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Carousel>{colorsArray}</Carousel>
      </div>
    </div>
  )
}

const container = document.body.querySelector("#container") as Element
const root = createRoot(container)

root.render(<App />)
