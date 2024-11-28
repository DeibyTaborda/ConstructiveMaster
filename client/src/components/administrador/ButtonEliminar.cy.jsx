import React from 'react'
import ButtonEliminar from './ButtonEliminar'

describe('<ButtonEliminar />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<ButtonEliminar />)
  })
})