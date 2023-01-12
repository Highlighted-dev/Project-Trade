describe('Favourites test', () => {
  it('Checks if favourites are showed properly', () => {
    cy.request('POST', 'http://localhost:5000/api/auth/login', {
      email: 'Test1@gmail.com',
      password: 'Test1@gmail.com',
    }).its('body');
    cy.visit('http://localhost:3000/Favourites');
    cy.findByText(
      'AmazonBasics PBH-48914 High-Speed HDMI 2.0 Cable, Ethernet, 3D, 4K Video Playback, and ARC, 3 Pack',
    ).should('exist');
    cy.findByText(
      'Amazon Basics 6ft High Speed HDMI Cable 2.0 Ethernet 3D 4K Video and ARC 3 Pack',
    ).should('exist');
    cy.get('.image')
      .find('img')
      .first()
      .should('have.attr', 'src', 'https://m.media-amazon.com/images/I/7178cUjo4jL._AC_UL320_.jpg');
    cy.get('.image')
      .find('img')
      .last()
      .should('have.attr', 'src', 'https://m.media-amazon.com/images/I/61aivGaiCCL._AC_UL320_.jpg');
  });
});
export {};
