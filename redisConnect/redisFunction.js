const client = require('./redis');

async function setRedisValue(key, value) {
    try {
        // await client.set(key, JSON.stringify(value));
        return true; 
    } catch (error) {
        console.error('Error setting value in Redis:');
        return false; 
    }
}



async function getRedisValue(key) {
    try {
        console.log(key);
        const newww = await client;
        // const data = newww.get(key);
        // console.log(data);
        return true; 
    } catch (error) {
        console.error('Error getting value in Redis:');
        return false; 
    }
}




module.exports = {setRedisValue , getRedisValue};
