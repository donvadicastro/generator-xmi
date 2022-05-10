"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeConverter = void 0;
class TypeConverter {
    static isPrimitive(typeName) {
        if (typeName.endsWith('__')) {
            typeName = typeName.slice(0, typeName.length - 2);
        }
        return !!this.typesMap[typeName.toLowerCase()];
    }
    static convert(typeName) {
        let isArray = false;
        if (typeName.endsWith('__')) {
            isArray = true;
            typeName = typeName.slice(0, typeName.length - 2);
        }
        return (this.typesMap[typeName.toLowerCase()] || typeName) + (isArray ? '[]' : '');
    }
    static isArray(typeName) {
        return typeName.endsWith('__');
    }
    static getTypeDefaultValue(type) {
        return { 'string': '\'\'', 'Date': 'new Date()', 'number': '0', 'boolean': 'false' }[type] || 'null';
    }
    static getTypeAllowedValues(type) {
        return { 'boolean': [true, false] }[type] || [];
    }
    static getType(typeId, dialect) {
        return this.typesDialectMap[typeId] ? this.typesDialectMap[typeId][dialect] : typeId;
    }
}
exports.TypeConverter = TypeConverter;
TypeConverter.typesMap = {
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
TypeConverter.typesDialectMap = {
    'string': { 'js': 'string', 'java': 'String' },
    'Date': { 'js': 'Date', 'java': 'Date' },
    'number': { 'js': 'number', 'java': 'int' },
    'boolean': { 'js': 'boolean', 'java': 'boolean' },
    'void': { 'js': 'void', 'java': 'void' },
};
//# sourceMappingURL=typeConverter.js.map