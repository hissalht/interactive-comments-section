function getInputByLabel(label: string) {
  return cy
    .contains("label", label)
    .invoke("attr", "for")
    .then((id) => {
      cy.get("#" + id);
    });
}

describe("Comments section", () => {
  it("User can create, edit and delete a comment", () => {
    cy.visit("/");

    // Create the comment
    const comment =
      "Incididunt amet sit aute quis in irure aute aliqua sunt pariatur cillum.";
    cy.get("textarea").type(comment);
    cy.contains("Send").click();
    cy.contains(comment);

    // Edit the comment
    cy.contains("Edit").click();
    const commentEdit = " EDIT: Quis ex proident irure consectetur.";
    getInputByLabel("Edit your comment").type(commentEdit);
    cy.contains("Update").click();
    cy.contains(comment + commentEdit);

    // Delete the comment (cancelled)
    cy.contains("Delete").click();
    cy.contains("No, cancel").click();
    cy.contains(comment + commentEdit);

    // Delete the comment (for real this time !)
    cy.contains("Delete").click();
    cy.contains("Yes, delete").click();
    cy.contains(comment + commentEdit).should("not.exist");
  });
});
