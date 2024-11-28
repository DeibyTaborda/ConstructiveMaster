import React from 'react'
import ButtonPequenoNaranja from './ButtonPequeñoNaranja'

describe('<ButtonPequenoNaranja />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<ButtonPequenoNaranja />)
  })
})