import { createClient } from 'redis';

export default () => {
    const client = createClient();
    return client;
};
