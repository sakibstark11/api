import pino from 'pino';

export default pino(
    {
        base: undefined,
        timestamp:
            () => `,"time":"${new Date(Date.now()).toISOString()}"`,
    }
);
