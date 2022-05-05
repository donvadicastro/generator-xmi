import {$} from "protractor";

export class EditorPageObject {
    get container() { return $('app-exchange-edit'); }
    get titleText() { return $('app-root h3').getText(); }
    get saveButton() { return $('button.btn-primary'); }
    get deleteButton() { return $('button.btn-danger'); }
}
