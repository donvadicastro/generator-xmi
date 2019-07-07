import {$, $$, browser, ElementFinder} from "protractor";

export class ListPageObject {
    baseUrl:  string;

    get title() { return $('app-root h3'); }
    get titleText() { return this.title.getText(); }
    get addNewButton(): ElementFinder { return $('app-root .btn-primary'); }

    get list() { return $('.ui-table-wrapper table'); }
    get listHeaders() { return $$('.ui-table-wrapper table thead tr th').getText(); }
    get listRawData() { return $$('.ui-table-wrapper table tbody tr').map(x => (<ElementFinder>x).$$('td').getText()); }

    get listData(): Promise<any[]> {
        return (async () => {
            const headers = await this.listHeaders;
            const actual = (await this.listRawData).map((x: any) => (<any[]>x).reduce((prev, y, i) => {
                prev[<any>headers[i]] = y;
                return prev;
            }, {}));

            return actual;
        })();
    }

    async getPresenceOf(item: any): Promise<boolean> {
        const actual = await this.listData;
        const keys = Object.keys(item);

        return  actual.find(x => keys.reduce((res, y) => {
            if(x[y] !== item[y]) {
                res = false;
            }

            return res;
        }, true)) !== undefined;
    }

    async openEntity(id: string) {
        const cell = this.list.$(`td a[ng-reflect-router-link="${id}"]`);

        await browser.wait(cell.isDisplayed(), 1000);
        await cell.click();
    }

    navigateTo(page?: string) {
        return browser.get(browser.baseUrl + this.baseUrl + (page || '')) as Promise<any>;
    }
}
