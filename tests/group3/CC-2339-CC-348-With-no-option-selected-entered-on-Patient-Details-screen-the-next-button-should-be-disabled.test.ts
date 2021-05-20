import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-2339
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep(
      "Login to Cupcake portal as a clinic coordinator",
      async () => {
        await this.homePage.start();
        await this.loginPage.setEmailPasswordAndThenSubmit();
      }
    );
    this.addTestStep(`Go to Patient list`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
    });
    this.addTestStep(
      "Click 'ADD PATIENT' button and With no option selected/entered on Patient Details screen",
      async () => {
        await this.dashboardPage.clickAddPatientButton();
        await this.addPatientPage.waitForMe();
        expect(
          await this.tab.getAttribute(
            "button[data-test-id='next-btn']",
            "class"
          )
        ).toContain("disabled");
      }
    );
  }
}

new TestCase(
  "CC-348",
  "With no option selected/entered on Patient Details screen, the next button should be disabled."
);