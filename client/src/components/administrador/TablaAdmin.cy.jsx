import React from 'react'
import TablaAdmin from './TablaAdmin'

describe('<TablaAdmin />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<TablaAdmin />)
  })
})