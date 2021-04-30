import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-138
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('login', async () => {
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

new TestCase('CC-138', 'Verification: User is redirected to dashboard after successful login');
