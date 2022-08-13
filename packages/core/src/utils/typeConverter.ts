import {DialectType} from "../types";

type StringDictionary = { [key: string]: string };
type ArrayDictionary = { [key: string]: any[] };

export class TypeConverter {
    private static typesMap: StringDictionary = {
        eajava_char: 'string',
        eajava_string: 'string',
        eajava_date: 'Date',
        eajava_int: 'number',
        eajava_void: 'void',
        eajava_boolean: 'boolean',
        eajava_float: 'number',
        eajava_double: 'number',
        eajava_byte: 'number',

        eanone_void: 'void',

        int: 'number',
        char: 'string',
        boolean: 'boolean',

        'http://schema.omg.org/spec/uml/2.1/uml.xml#string': 'string',
        'http://schema.omg.org/spec/uml/2.1/uml.xml#integer': 'number'
    };

    public static isPrimitive(typeName: string): boolean {
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
        return (<StringDictionary>{'string': '\'\'','Date': 'new Date()', 'number': '0', 'boolean': 'false'})[type] || 'null';
    }

    public static getTypeAllowedValues(type: string): any[] {
        return (<ArrayDictionary>{'boolean': [true, false]})[type] || [];
    }

    public static getType(typeId: string, dialect: DialectType): string {
        return this.typesDialectMap[typeId] ? this.typesDialectMap[typeId][dialect] : typeId;
    }

    private static typesDialectMap: {[key: string]: StringDictionary} = {
        'string':       { 'js': 'string',       'java': 'String'    },
        'Date':         { 'js': 'Date',         'java': 'Date'      },
        'number':       { 'js': 'number',       'java': 'int'       },
        'boolean':      { 'js': 'boolean',      'java': 'Boolean'   },
        'void':         { 'js': 'void',         'java': 'void'      },
    }
}
