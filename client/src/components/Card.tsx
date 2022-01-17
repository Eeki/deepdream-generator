import React, { ReactNode } from 'react'
import { Flex, FlexProps, useMediaQuery } from '@chakra-ui/react'

import { largeScreenWidth } from '../libs/const'

interface CardProps extends FlexProps {
  children: ReactNode
}

export function Card({ children, ...restProps }: CardProps): JSX.Element {
  const [isLargeScreen] = useMediaQuery(`(min-width: ${largeScreenWidth}px)`)

  const largeScreenProps = isLargeScreen
    ? { boxShadow: '2xl', borderWidth: '1.1px', borderRadius: 'lg' }
    : {}

  return (
    <Flex {...largeScreenProps} {...restProps}>
      {children}
    </Flex>
  )
}
