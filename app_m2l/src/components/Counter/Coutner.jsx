import { effect, signal } from '@preact/signals-react'
import React, { useState } from 'react'

import './Counter.css'

const count = signal(0)

/**
 * Renders a button component that performs different actions based on the "action" prop.
 *
 * @param {Object} props - The props object containing the "action" prop.
 * @param {string} props.action - The action to be performed by the button.
 *   Possible values are "increment", "decrement", or "reset".
 *
 * @return {React.Element} The rendered button component.
 */
const CounterButton = ({ action }) => {
  const handleButtonClick = () => {
    if (action === 'increment') {
      count.value += 1
    } else if (action === 'decrement') {
      count.value -= 1
    } else if (action === 'reset') {
      count.value = 0
    }
  }
  return (
    <button onClick={handleButtonClick}>
      {action === 'increment' && 'Increment'}
      {action === 'decrement' && 'Decrement'}
      {action === 'reset' && 'Reset'}
    </button>
  )
}

/**
 * Renders the Counter component.
 *
 * @return {JSX.Element} The rendered Counter component.
 */
const Coutner = () => {
  return (
    <div id="counter">
      <div className="display">
        <span id="countValue">{count.value}</span>
      </div>
      <div className="controls">
        <CounterButton action="decrement" />
        <CounterButton action="reset" />
        <CounterButton action="increment" />
      </div>
    </div>
  )
}

export default Coutner
