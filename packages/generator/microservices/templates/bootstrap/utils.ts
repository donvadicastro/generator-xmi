export const utils = {
    decode: (message: {value: string}): any => {
        const buf = new Buffer(<string>message.value, "binary");

        try {
            return JSON.parse(buf.toString());
        } catch (e) {
            return null;
        }
    },

    encode: (data: any): string => {
        return JSON.stringify(data);
    }
};
