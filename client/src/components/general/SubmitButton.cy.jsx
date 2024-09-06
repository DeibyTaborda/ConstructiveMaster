import React from 'react'
import SubmitButton from './SubmitButton'

describe('<SubmitButton />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<SubmitButton />)
  })
})