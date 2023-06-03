export class ActionParams {
    enabled: boolean;
    showEdit?: boolean;
    showDelete?: boolean;
    showRadiobutton?: boolean;
    showCheckbox?: boolean;
    constructor() {
    }
}

export enum ngColumnType {
    link = 'link',
    contentEditable = 'contentEditable',
    date = 'date',
    decimal = 'decimal'
}
