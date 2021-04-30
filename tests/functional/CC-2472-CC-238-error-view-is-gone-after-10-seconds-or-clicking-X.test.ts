import AppConf from "../src/AppConf";
import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-238
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Go to Cupсake Sign in form', async () => {
      await this.homePage.start();
      await this.loginPage.waitForMe();
    });

    this.addTestStep('login error and click toastX', async () => {
      this.loginPage.username = AppConf.userName().substr(1);
      this.loginPage.password = AppConf.password();
  
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.loginPage.waitForToast("Invalid login ID or password");
      await this.loginPage.tab.screenshot({path:'./tests/output/CC-238-step2-login-error.png'});
      await this.loginPage.clickToastX()
      // wait for toast disappear
      this.loginPage.sleep(2000)
      expect(this.loginPage.isToastExist()).resolves.toBe(null)
    });

    this.addTestStep('login error and wait 10s', async () => {
      await this.loginPage.submit();
      await this.loginPage.waitForToast("Invalid login ID or password");
      await this.loginPage.tab.screenshot({path:'./tests/output/CC-238-step3-login-error.png'});
      this.loginPage.sleep(12000)
      expect(this.loginPage.isToastExist()).resolves.toBe(null)
    });
  }
}

new TestCase('CC-238', 'Verification: Error view is gone after 10 seconds or when user clicking on “X”');

