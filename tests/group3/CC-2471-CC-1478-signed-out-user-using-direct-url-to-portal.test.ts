import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-1478
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Go to Cupсake Sign in form', async () => {
      await this.homePage.start();
      await this.loginPage.waitForMe();
    });
    
    this.addTestStep('Try to enter on portal using direct link', async () => {
      await this.dashboardPage.goto();
      await this.loginPage.waitForMe();
    });
  }
}

new TestCase('CC-1478', 'Verification: Signed out user is NOT able to enter on portal using direct url');

