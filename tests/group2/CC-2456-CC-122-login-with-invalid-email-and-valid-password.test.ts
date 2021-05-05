import AppConf from "../src/AppConf";
import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-122
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Start', async () => {
      await this.homePage.start();
      await this.loginPage.waitForMe();
    });

    this.addTestStep('Login with invalid Email and valid Password', async () => {
      this.loginPage.username = AppConf.userName().substr(1);
      this.loginPage.password = AppConf.password();
  
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.loginPage.waitForToast("Invalid login ID or password");
    });
  }
}

new TestCase('CC-122', 'Verification: User is not able to Login with invalid Email and valid Password');

