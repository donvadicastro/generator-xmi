export class TypeConverter {
    private static typesMap: {[key: string]: string} = {
        EAJava_char: 'string',
        EAJava_String: 'string',
        EAJava_date: 'Date',
        EAJava_int: 'number',
        EAJava_void: 'void',
        EAJava_boolean: 'boolean',
        EAJava_float: 'number',

        int: 'number',
        char: 'string',
        boolean: 'boolean',

        'http://schema.omg.org/spec/UML/2.1/uml.xml#String': 'string'
    };

    public static isPrimititive(typeName: string): boolean {
        if(typeName.endsWith('__')) {
            typeName = typeName.slice(0, typeName.length - 2);
        }

        return !!this.typesMap[typeName];
    }

    public static convert(typeName: string): string {
        let isArray = false;

        if(typeName.endsWith('__')) {
            isArray = true;
            typeName = typeName.slice(0, typeName.length - 2);
        }

        return (this.typesMap[typeName] || typeName) + (isArray ? '[]' : '');
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
}