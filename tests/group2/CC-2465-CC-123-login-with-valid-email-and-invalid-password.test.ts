import AppConf from "../src/AppConf";
import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-123
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Start', async () => {
      await this.homePage.start();
      await this.loginPage.waitForMe();
    });

    this.addTestStep('Login with valid Email and invalid Password', async () => {
      this.loginPage.username = AppConf.userName();
      this.loginPage.password = AppConf.password().substr(1);
  
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.loginPage.waitForToast("Invalid login ID or password");
    });
  }
}

new TestCase('CC-123', 'Verification: User is not able to Login with Valid Email and Invalid Password');

