import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-901
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    });

    this.addTestStep("ciinic logo, clinic banner and clinic name are correctly placed and displayed", async () => {
      await this.tab.waitForSelector(this.dashboardPage.css_ciinic_logo);
      await this.tab.waitForSelector(this.dashboardPage.css_ciinic_name);
      await this.tab.waitForSelector(this.dashboardPage.css_ciinic_banner);
    });
  }
}
new TestCase('CC-591', 'Verification: Clinic logo, clinic banner and clinic name are properly placed and displayed on dashboard header');

