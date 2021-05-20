import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-2331
class TestCase extends MockableTestCase {

  patient: Map<string, string>;

  patientName: string;

  createTestSteps(): void {
    this.addTestStep(
      "Login to Cupcake portal as a clinic coordinator",
      async () => {
        await this.homePage.start();
        await this.loginPage.setEmailPasswordAndThenSubmit();
      }
    );
    this.addTestStep(`Go to Dashboard Page and Click 'ADD PATIENT' button`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.clickAddPatientButton();
      await this.addPatientPage.waitForMe();
    });
    
    this.addTestStep(
      `In Email field enter data with max 255 characters and click on 'SAVE CHANGES' button`,
      async () => {
        await this.addPatientPage.waitForPatientDetailsPage();
        await this.addPatientPage.setEmail('Germanyukrainenetherlandsnhytrnbvbnbvbnbickandmortyforevercomriy@caiuepsiegishvdhaugefgakgflahvaofaegjashcgisuuagahlscjCNsvknaks.caiuepsiegishvdhaugefgakgflahvaofaegjashcgisuuagahlscjCNsvknaks.caiuepsiegishvdhaugefgakgflahvaofaegjashcgisuuagahlscjCNsv.com');
        await this.addPatientPage.waitForNoText('Please enter a valid email address');
      }
    );

    this.addTestStep(
      `In Email field enter data with more than 255 characters and click on 'SAVE CHANGES' button`,
      async () => {
        await this.addPatientPage.waitForPatientDetailsPage();
        await this.addPatientPage.setEmail('caiuepsiegishvdhaugefgakgflahvaofaegjashcgisuuagahlscjCNsvknaks.caiuepsiegishvdhaugefgakgflahvaofaegjashcgisuuagahlscjCNsvknaks.caiuepsiegishvdhaugefgakgflahvaofaegjashcgisuuagahlscjCNsvknaks.caiuepsiegishvdhaugefgakgflahvaofaegjashcgisuuagahlscjCNsvk.com');
        await this.addPatientPage.waitForText('Please enter a valid email address');
      }
    );
  }
}

new TestCase(
  "CC-873",
  `Max 255 characters are accepted in Email field`
);