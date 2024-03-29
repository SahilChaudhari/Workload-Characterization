const amqp = require("amqplib");
// json object
var input = connect();
console.log(input)
async function connect(){
    var f_output = "";
    try{
        const connnection = await amqp.connect("amqp://localhost:5672")
        const channel = await connnection.createChannel();
        // make sure queue exit if not will create one
        const result1 = channel.assertQueue("fname");
        // send to queue
        // channel.sendToQueue("fname", Buffer.from(JSON.stringify(msg)))
        channel.consume("fname",message => {
            f_output = JSON.parse(message.content.toString() );
            console.log(`Recieved job successfully with file ${f_output}`);
            channel.ack(message);
        })
        return
    }
    catch (ex){
        console.error(ex)
        return
    }
}