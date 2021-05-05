import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-1756
class TestCase extends MockableTestCase {

  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    });

    this.addTestStep('Verify if the "Needs attention" toggle is "ON"', async () => {
      if (!(await this.tab.isChecked(this.dashboardPage.css_needsAttention))){
        await this.dashboardPage.clickNeedsAttention();
      }
    });

    this.addTestStep('Sort the patients by stage using "All Stages" drop-down or pipeline and verify if the "Needs attention" toggle is still "ON"', async () => {
      await this.dashboardPage.clickPiplineCandidates();
      let status_1 = await this.tab.isChecked(this.dashboardPage.css_needsAttention);
      expect(status_1).toBe(true);
      await this.dashboardPage.clickPiplineAwaitingSurgery();
      let status_2 = await this.tab.isChecked(this.dashboardPage.css_needsAttention);
      expect(status_2).toBe(true);
      await this.dashboardPage.searchByStage("All Stages")
      let status_3 = await this.tab.isChecked(this.dashboardPage.css_needsAttention);
      expect(status_3).toBe(true);
    });
  }
}
new TestCase('CC-1756', 'Verification: CupCake portal user can see the "Needs attention" toggle is "ON" after sorting patients by stage(if already ON).');

