import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-139
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
    
    this.addTestStep('Logout', async () => {
      await this.dashboardPage.logout();
      await this.loginPage.waitForMe();
    });
  }
}

new TestCase('CC-139', 'Verification: Whether "Sing out" button redirects to login/Welcome page');

