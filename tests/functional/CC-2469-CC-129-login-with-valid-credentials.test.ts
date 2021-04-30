import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-129
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('start', async () => {
      await this.homePage.start();
      await this.loginPage.waitForMe();
    })
    this.addTestStep('setEmailAndPassword', async () => {
      await this.loginPage.setEmailAndPassword();
      await this.loginPage.waitForMe();
    })
    this.addTestStep('submit', async () => {
     await this.loginPage.submit();
     await this.dashboardPage.waitForMe();  
   })
  }
}

new TestCase('CC-129', 'Existing user is able to Login with valid credentials');
