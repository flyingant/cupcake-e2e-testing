import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-135
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('start', async () => {
      await this.homePage.start();
      await this.loginPage.waitForMe();
    })
    this.addTestStep('login with blank password', async () => {
      await this.loginPage.setEmail();
      await this.loginPage.waitForMe();
      let status=this.loginPage.isSubmitButtonEnable();
      expect(status).resolves.toEqual(false);
    })
      this.addTestStep('login with blank userName', async () => {
      this.loginPage.tab.reload(); 
      await this.loginPage.waitForMe(); 
      await this.loginPage.setPassword();
      let status=this.loginPage.isSubmitButtonEnable();
      expect(status).resolves.toEqual(false); 
    })  
  }
}

new TestCase('CC-135', 'Verification: Existing user is not able to Login with bank username or password');

