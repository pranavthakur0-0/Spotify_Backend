const { createClient, createPool } = require('redis');

const redisOptions = {
    password: 'VoHXMV1DQARBpYRicJwWcjHnUY8R9UHI',
    socket: {
        host: 'redis-19478.c261.us-east-1-4.ec2.cloud.redislabs.com',
        port: 19478
    }
};

const client = createClient(redisOptions);



client.on('connect', () => {
    console.log('Client is connected');
});

client.on('ready', () => {
    console.log('Client is connected and ready to use');
});

client.on('error', (err) => {
    console.log('Error: ', err);
});

client.on('end', () => {
    console.log('Client is disconnected');
});

// Gracefully close the Redis client when the Node.js process exits
process.on('SIGINT', () => {
    client.quit(() => {
        console.log('Client is closed');
        process.exit();
    });
});

module.exports = { client };
