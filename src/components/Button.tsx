import ButtonProps from '../interface/Button'
import React from 'react'

const Button:React.FC<ButtonProps> = ({children,
  onClick,
  type = "button",
  disabled = false,
  className = "",}) => {
  return (
    <button onClick={onClick} type={type} disabled={disabled} className={className}>
      {children}
    </button>
  )
}

export default Button
