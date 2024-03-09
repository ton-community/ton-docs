import Link from '@docusaurus/Link'
import React from 'react'

// <Link
// className="button button--secondary button--lg"
//
//
//     to="/docs/intro">
//     Серая
// </Link>

interface IButtonProps {
    sizeType: 'lg' | 'sm'
    href: string
    colorType: 'primary' | 'secondary'
    children: string
}

const Button = (props: IButtonProps) => {
  const classNames = `button button--${props.colorType} button--${props.sizeType}`

  return (
    <Link
      className={classNames}
      to={props.href}
    >
      {props.children}
    </Link>
  )
}

export default Button
