import React from 'react'
import { NavLink } from 'react-router-dom'

const NavLinkComp = ({
  componentFrom,
  to,
  title,
  className
}) => {

  return (
    <NavLink to={to} className={`${className}`}>
      {title}
    </NavLink>
  )
}

export default NavLinkComp