import React from 'react'
import ConfirmDelete from './ConfirmDelete'

describe('<ConfirmDelete />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<ConfirmDelete />)
  })
})