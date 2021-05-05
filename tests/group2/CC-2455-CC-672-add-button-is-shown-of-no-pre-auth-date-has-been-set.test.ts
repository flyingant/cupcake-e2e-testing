import format from 'date-fns/format';
import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-672
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    });
    this.addTestStep("Go to Setting on clinic profile page", async () => {
      await this.dashboardPage.setAuthDate();
      await this.dashboardPage.waitForText("Schedule");
    });
  }
}
new TestCase('CC-672', 'Verification: Add "+" button is shown, if no pre auth date has been set');

