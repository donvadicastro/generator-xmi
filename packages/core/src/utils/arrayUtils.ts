export class ArrayUtils {
    public static insertIfNotExists(entity: any, array: any[]) {
        array.indexOf(entity) >= 0 || array.push(entity);
    }
}