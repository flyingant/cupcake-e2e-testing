import SettingsPage from './SettingsPage';
import TestComponent from './TestComponent';
import Faker from 'faker'

export default class AddStaffPage extends TestComponent {
    async waitForMe() {
        await this.waitForText("Add staff member")
    }

    async setFirstName(value: string) {
        let inputs = await this.tab.$$("input");
        await inputs[0].fill(value);
    }

    async setLastName(value: string) {
        let inputs = await this.tab.$$("input");
        await inputs[1].fill(value);
    }

    async setEmail(value: string) {
        let inputs = await this.tab.$$("input");
        await inputs[2].fill(value);
    }

    async clickCloseButton() {
        await this.tab.click('css=button[aria-label="delete"]')
    }

    async clickAddButton() {
        await this.tab.click("css=img[alt='add']");
        await this.waitForToast("Invitation sent to")
        let page = new SettingsPage(this.tab);
        page.waitForMe();
        return page;
    }

    generateStaffData(){
        let first_name = Faker.name.firstName(1);
        if (first_name.length <3){
            first_name = first_name + "o"
        }
        let last_name = Faker.name.lastName(1);
        let email = Faker.internet.email(first_name, last_name, "cupcake.com"); 
        return [first_name, last_name, email]
    }

}
