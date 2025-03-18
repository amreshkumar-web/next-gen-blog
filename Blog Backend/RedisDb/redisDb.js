const redis = require("redis");

const client = redis.createClient({
    url:'redis://localhost:6379'
})

client.on('connect',()=>{
    console.log('redis connected');
})

client.on('error',(error)=>{
    console.log('redis error',error);
})
client.connect();
module.exports = client;