describe('Product page test', () => {
  it('Goes to product page and checks if every information is displayed corretly', () => {
    cy.request('POST', 'http://localhost:5000/api/auth/login', {
      email: 'Test1@gmail.com',
      password: 'Test1@gmail.com',
    }).its('body');
    cy.visit('http://localhost:3000/Product/B09JQZ5DYM');
    cy.wait(4000);
    cy.findByText('Apple AirPods Pro with MagSafe charging case (2021)').should('exist');
    cy.get('#images')
      .find('img')
      .should(
        'have.attr',
        'src',
        'https://m.media-amazon.com/images/I/31G4DtYkP+L._AC_SR38,50_.jpg',
      );
    cy.get('#highresImages')
      .find('img')
      .should(
        'have.attr',
        'src',
        'https://m.media-amazon.com/images/I/71bhWgQK-cL._AC_SL1500_.jpg',
      );
    cy.findByText('DETAILS').should('exist');
    cy.findByText('ABOUT').should('exist');
    cy.get('#productPricesDiv').within(() => {
      cy.get('canvas');
    });
    cy.get('#productSalesDiv').within(() => {
      cy.get('canvas');
    });
  });
});
export {};
