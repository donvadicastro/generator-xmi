import {Message} from "kafka-node";

export const utils = {
    decode: (message: Message): any => {
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