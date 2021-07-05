// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
declare namespace Cypress {
  interface Chainable<Subject = any> {
    getElement(param: string): Chainable<Subject>;
    findElement(param: string): Chainable<Subject>;
    openFirstPokeCatchMenu(): any;
    releaseFirstPoke(): any;
  }
}
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("getElement", (elementName) => {
  cy.get(`[data-smoke="${elementName}"]`);
})

Cypress.Commands.add("findElement", (elementName) => {
  cy.find(`[data-smoke="${elementName}"]`);
})

Cypress.Commands.add("openFirstPokeCatchMenu", () => {
  cy.getElement('poke-list-item').first().then((row => {
    cy.wrap(row).find('[data-smoke="poke-action-catch"]').then(catchAction => {
      cy.wrap(catchAction).click();
    });
  }))
})

Cypress.Commands.add("releaseFirstPoke", () => {
  cy.getElement('poke-list-item').first().then((row => {
    cy.wrap(row).find('[data-smoke="poke-action-release"]').click();
  }))
})
