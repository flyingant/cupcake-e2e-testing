import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-1036
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    });

    this.addTestStep("Go to Patient details page", async () => {
      await this.dashboardPage.hoverPatientName()
      await this.dashboardPage.clickViewDetails()
      await this.patientDetailPage.waitForMe();
    });
    this.addTestStep("Verify if Schedule date in Pre-Auth section, is displayed as blue calendar", async () => {
      await this.patientDetailPage.clickPreAuth();
      await this.calendarPage.clickSetDate();
      await this.tab.waitForSelector(this.calendarPage.css_setDate, {state: "attached"});
      let content = await this.tab.content();
      let css_style = content.match(/.MuiButton-containedPrimary {[\s\S]*?}/)[0];
      expect(css_style).toContain("008ecd")
    });
  }
}
new TestCase('CC-1036', 'Verification: Schedule date on Pre-Auth section is displayed as a blue calendar on Patient detail screen');

