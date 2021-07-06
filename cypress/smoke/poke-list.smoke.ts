import {DEFAULT_VISIBLE_POKE_DETAILS_COUNT} from "../../src/app/constants/defaults.constants";

describe('Page list component', () => {

  before(() => {
    cy.visit('http://localhost:4200/', {timeout: 20000});
  });

  it('Renders list of pokemons on entry', () => {
    cy.get('app-poke-list', {timeout: 20000}).should('be.visible');
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
    cy.getElement('poke-search-box').type('Abr');
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

  it(`Can render details`, () => {
    cy.openFirstPokeDetailsDrawer();
    cy.getElement('poke-details-moves').should('be.visible').then(movesContainer => {
      cy.getElement('poke-moves-count').then(span => {
        const totalMoves = ((span as any)[0] as HTMLSpanElement).innerHTML;
        cy.wrap(movesContainer).find('[data-smoke="poke-move-link"]').should('have.length', DEFAULT_VISIBLE_POKE_DETAILS_COUNT);
        cy.wrap(movesContainer).find('[data-smoke="poke-move-show-all-link"]').click();
        cy.wrap(movesContainer).find('[data-smoke="poke-move-link"]').should('have.length', totalMoves);
        cy.wrap(movesContainer).find('[data-smoke="poke-move-show-less-link"]').click();
        cy.wrap(movesContainer).find('[data-smoke="poke-move-link"]').should('have.length', DEFAULT_VISIBLE_POKE_DETAILS_COUNT);
      });
    });
    cy.getElement('poke-details-types').first().should('be.visible').then(typesContainer => {
      cy.getElement('poke-names-count').then(span => {
        const totalPokeNames = ((span as any)[0] as HTMLSpanElement).innerHTML;
        cy.wrap(typesContainer).find('[data-smoke="poke-name-link"]').should('have.length', DEFAULT_VISIBLE_POKE_DETAILS_COUNT);
        cy.wrap(typesContainer).find('[data-smoke="poke-name-show-all-link"]').click();
        cy.wrap(typesContainer).find('[data-smoke="poke-name-link"]').should('have.length', totalPokeNames);
        cy.wrap(typesContainer).find('[data-smoke="poke-name-show-less-link"]').click();
        cy.wrap(typesContainer).find('[data-smoke="poke-name-link"]').should('have.length', DEFAULT_VISIBLE_POKE_DETAILS_COUNT);
      });
    });
  })

})
