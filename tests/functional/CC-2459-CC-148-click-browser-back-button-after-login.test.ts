import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-148
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Start', async () => {
      await this.homePage.start();
      await this.loginPage.waitForMe();
    });

    this.addTestStep('Login', async () => {
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    });
    
    this.addTestStep('goback', async () => {
      await this.tab.goBack();
      await this.dashboardPage.waitForMe();
    });
  }
}

new TestCase('CC-148', 'Verification: Clicking on browser back button after successful login should not take User to log out mode');

