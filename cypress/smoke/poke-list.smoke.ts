
describe('Page list component', () => {

  before(() => {
    cy.visit('http://localhost:4200/');
  });

  it('Renders list of pokemons on entry', () => {
    cy.get('app-poke-list').should('be.visible');
  });

  it('Should have paging available', () => {
    cy.getElement('poke-list-item').should('have.length', 10);
    cy.get('[nz-pagination-options]').first().find('nz-select').click();
    cy.get('nz-option-item').eq(1).click();
    cy.getElement('poke-list-item').should('have.length', 20);
  });

  it('Can catch and release a Pokemon', () => {
    cy.openFirstPokeCatchMenu();
    cy.getElement('poke-action-catch-wishlist-button').should('be.visible').should('be.enabled').then(button => {
      cy.wrap(button).click();
      cy.wrap(button).should('be.disabled');
      cy.contains('Wishlisted a Pokemon');
      cy.get('.ant-notification-notice-close').click();
    });
    cy.openFirstPokeCatchMenu();
    cy.getElement('poke-action-catch-catch-button').should('be.visible').should('be.enabled').then(button => {
      cy.wrap(button).click();
      cy.wrap(button).should('be.disabled');
      cy.contains('Caught a Pokemon');
      cy.get('.ant-notification-notice-close').click();
    });
    cy.releaseFirstPoke();
    cy.contains('Released a Pokemon');
  });

  it('Can find Pokemon by name', () => {
    cy.getElement('poke-search-box').type('abr');
    cy.wait(1000);
    cy.getElement('poke-list-item').should('have.length', 3).first().then((row => {
      cy.wrap(row).find('[data-smoke="poke-name"]').contains('abra');
    }));
    cy.getElement('poke-clear-search').invoke('show').click();
    cy.wait(1000);
    cy.getElement('poke-list-item').should('have.length', 20).first().then((row => {
      cy.wrap(row).find('[data-smoke="poke-name"]').contains('abomasnow');
    }));
  });

})
