import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-635
class TestCase extends MockableTestCase {
  
  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    });

    this.addTestStep("Verify if the 'PSY.' column is shown and there is possibility to update data", async () => {
      await this.dashboardPage.waitForText("'Psy. '");
      let fullname = await this.tab.innerText(this.dashboardPage.css_patientFullName)
      await this.dashboardPage.searchByName(fullname)
      let status = await this.dashboardPage.getPsyStatus();
      if (status != "success"){
        await this.dashboardPage.setPsyToCompleted();
        await this.dashboardPage.waitForTimeout(2000)
        let status = await this.dashboardPage.getPsyStatus();
        expect(status).toBe("success");
      }else{
        await this.dashboardPage.setPsyToFailed();
        await this.dashboardPage.waitForTimeout(2000)
        let status = await this.dashboardPage.getPsyStatus();
        expect(status).toBe("failed");
      }
    });
  }
}
new TestCase('CC-635', 'Verification: CupCake portal user is able to see and update the psych eval info');

