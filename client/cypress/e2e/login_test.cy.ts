describe('login test', () => {
  it('Log ins into the website', () => {
    cy.visit('http://localhost:3000');
    cy.findByLabelText('Email').type('Test1@gmail.com');
    cy.findByLabelText('Password').type('Test1@gmail.com');
    cy.findByText('Sign in').click();
    cy.findByText('Home').should('exist');
  });
});
export {};
