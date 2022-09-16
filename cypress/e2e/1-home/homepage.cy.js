describe("homepage", () => {
  beforeEach(() => {
    cy.visit("http://localhost:1606/index.html");
  });

  it("displays the title", () => {
    cy.get(".header-container h1").should("have.text", "Find your film");
  });

  it("displays the default empty state", () => {
    cy.get(".start-exploring-text").should("have.text", "Start exploring");
  });

  it("can search for the movie Amelie", () => {
    cy.get(".search-input").type("Amelie{enter}");

    cy.get(".movie-result").should("have.length", "10");

    cy.get(".movie-result:nth-child(1) .movie-title a").should(
      "have.text",
      "Amélie"
    );

    cy.get(".movie-result:nth-child(1) .add-watchlist").click();

    cy.get(".movie-result:nth-child(1) .remove-watchlist").should("exist");
  });
});
