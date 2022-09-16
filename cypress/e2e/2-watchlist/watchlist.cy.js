describe("watchlist", () => {
  beforeEach(() => {
    cy.visit("http://localhost:1606/watchlist.html");
  });

  describe("without items", () => {
    it("displays title of page", () => {
      cy.get(".header-container h1").should("have.text", "My Watchlist");
    });

    it("shows the empty watchlist when no films have been added yet", () => {
      cy.get(".empty-text").should(
        "have.text",
        "Your watchlist is looking a little empty..."
      );
    });
  });

  describe("with items", () => {
    before(() => {
      window.localStorage.setItem("IDsList", JSON.stringify(["tt0211915"]));
    });

    it("shows your added movies", () => {
      cy.get(".movie-title").should("have.text", "Amélie");
    });
  });
});
