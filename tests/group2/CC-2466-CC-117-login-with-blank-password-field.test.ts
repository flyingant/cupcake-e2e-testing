import AppConf from "../src/AppConf";
import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-117
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Start', async () => {
      await this.homePage.start();
      await this.loginPage.waitForMe();
    });

    this.addTestStep('Login with blank password', async () => {
      this.loginPage.username = AppConf.userName();
      this.loginPage.password = "";
  
      await this.loginPage.setEmailAndPassword();
      let status = this.loginPage.isSubmitButtonEnable()
      expect(status).resolves.toEqual(false)
    });
  }
}

new TestCase('CC-117', 'Verification: User is not able to Login with blank Password field');

