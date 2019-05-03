export class TypeConverter {
    private static typesMap: {[key: string]: string} = {
        eajava_char: 'string',
        eajava_String: 'string',
        eajava_date: 'Date',
        eajava_int: 'number',
        eajava_void: 'void',
        eajava_boolean: 'boolean',
        eajava_float: 'number',
        eajava_double: 'number',

        eanone_void: 'void',

        int: 'number',
        char: 'string',
        boolean: 'boolean',

        'http://schema.omg.org/spec/uml/2.1/uml.xml#string': 'string',
        'http://schema.omg.org/spec/uml/2.1/uml.xml#integer': 'number'
    };

    public static isPrimititive(typeName: string): boolean {
        if(typeName.endsWith('__')) {
            typeName = typeName.slice(0, typeName.length - 2);
        }

        return !!this.typesMap[typeName.toLowerCase()];
    }

    public static convert(typeName: string): string {
        let isArray = false;

        if(typeName.endsWith('__')) {
            isArray = true;
            typeName = typeName.slice(0, typeName.length - 2);
        }

        return (this.typesMap[typeName.toLowerCase()] || typeName) + (isArray ? '[]' : '');
    }

    public static isArray(typeName: string): boolean {
        return typeName.endsWith('__');
    }

    public static getTypeDefaultValue(type: string): any {
        let value;

        switch(type) {
            case 'string': value = '\'\''; break;
            case 'Date': value = '0'; break;
            case 'number': value = '0'; break;
            case 'boolean': value = 'false'; break;

            default: value = 'null';
        }

        return value;
    }

    public static getTypeAllowedValues(type: string): any[] {
        let value: any[] = [];

        switch(type) {
            case 'boolean': value = [true, false]; break;
            default: value = [];
        }

        return value;
    }
}
