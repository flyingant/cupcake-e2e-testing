import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-1380
class TestCase extends MockableTestCase {
  fullname: string
  physicianList: string[]

  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    });

    this.addTestStep("Click on any patient name on dashboard", async () => {
      let fullname = await this.tab.innerText(this.dashboardPage.css_patientFullName);
      await this.dashboardPage.searchByName(fullname);
      await this.dashboardPage.hoverPatientName();
      await this.dashboardPage.clickPatientName();
      await this.patientDetailPage.waitForMe();
    });
  }
}
new TestCase('CC-1380', 'Verification: Patient details page should show up when clicked on patient name on dashboard.');

