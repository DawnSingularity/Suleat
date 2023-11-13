import React, { PropsWithChildren } from 'react'
import styles from './carousel.module.css'
type PropType = PropsWithChildren<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
>

export const DotButton: React.FC<PropType> = (props) => {
  const { children, ...restProps } = props

  return (
    <button type="button" {...restProps}>
      {children}
    </button>
  )
}


const buttonPrev = 'embla__button--prev';

export const PrevButton: React.FC<PropType> = (props) => {
  const { children, ...restProps } = props

  return (
    <button
    className={`${styles.embla__button} ${styles.buttonPrev}`}
      type="button"
      {...restProps}
      style={{ pointerEvents: 'auto' }}
    >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full">
            <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
            </svg>
            <span className="sr-only">Previous</span>
        </span>
      {children}
    </button>
  )
}

const buttonNext = 'embla__button--next'


export const NextButton: React.FC<PropType> = (props) => {
  const { children, ...restProps } = props

  return (
    <button 
      className={`${styles.embla__button} ${styles.buttonNext} focus:outline-none`}
      type="button"
      {...restProps}
      style={{ pointerEvents: 'auto' }}
    >
<span className="inline-flex items-center justify-center w-10 h-10 rounded-full ">
  <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
  </svg>
  <span className="sr-only">Next</span>
</span>
      {children}
    </button>
  )
}