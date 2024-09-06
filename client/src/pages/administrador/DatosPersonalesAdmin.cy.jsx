import React from 'react'
import DatosPersonalesAdmin from './DatosPersonalesAdmin'

describe('<DatosPersonalesAdmin />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<DatosPersonalesAdmin />)
  })
})