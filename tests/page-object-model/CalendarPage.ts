import TestComponent from './TestComponent';

export default class CalendarPage extends TestComponent {
    css_AvailableDays = ":not(.react-datepicker__day--outside-month).react-datepicker__day[aria-label*=Choose]";
    css_setDate = "#setDate";
    
    async waitForMe(){
        await this.tab.waitForSelector(".react-datepicker")
    }

    async pickFistAvailableDay(){
        let choose_date = await this.tab.getAttribute(this.css_AvailableDays, "aria-label");
        await this.tab.click(this.css_AvailableDays);
        return choose_date
    }

    async pickNextAvailableDay(){
        let days = await this.tab.$$(this.css_AvailableDays);
        let choose_date = await days[1].getAttribute("aria-label");
        await days[1].click();
        return choose_date
    }

    async pickAvailableFromToday(days: number){
        let choose_date:string;
        let elems = await this.tab.$$(this.css_AvailableDays);
        if (elems.length < days){
            await this.tab.click("'Next Month'");
            await this.tab.click("'Next Month'");
            this.pickAvailableFromToday(days-elems.length);
        }else{
            choose_date = await elems[days].getAttribute("aria-label");
            await elems[days].click();
        }
        return choose_date.substring(choose_date.indexOf(","))
    }

    async clickSetDate(){
        await this.tab.click(".MuiList-padding .MuiListItemText-root")
    }
    
    async clickSet(){
        await this.tab.click("'Set'")
    }

    async clickSchedule(){
        await this.tab.click("'Schedule'")
    }


}