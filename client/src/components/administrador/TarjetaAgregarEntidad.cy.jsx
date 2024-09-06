import React from 'react'
import TarjetaAgregarEntidad from './TarjetaAgregarEntidad'

describe('<TarjetaAgregarEntidad />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<TarjetaAgregarEntidad />)
  })
})