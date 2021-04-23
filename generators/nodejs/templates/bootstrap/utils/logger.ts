import * as winston from "winston";

export class Logger {
    private _logger: any;
    private static _instanse: Logger | null = null;

    public static get instanse() {
        if(!this._instanse) {
            this._instanse = new Logger();
        }

        return this._instanse;
    }

    public static log(message: string) {
        this.instanse.log(message);
        return this.instanse;
    }

    public static error(message: string) {
        this.instanse.error(message);
        return this.instanse;
    }

    constructor() {
        this._logger = winston.createLogger({
            format: winston.format.simple(),
            transports: [
                new winston.transports.File({ filename: 'error.log', level: 'error' }),
                new winston.transports.File({ filename: 'info.log' })
            ]
        });

        // this._logger.add(new winston.transports.Console({
        //     format: winston.format.simple()
        // }));
    }

    public log(message: string) {
        this._logger.log({ level: 'info', message: message });
    }

    public error(message: string) {
        this._logger.log({ level: 'error', message: message });
    }
}