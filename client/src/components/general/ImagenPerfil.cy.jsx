import React from 'react'
import ImagenPerfil from './ImagenPerfil'

describe('<ImagenPerfil />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<ImagenPerfil />)
  })
})