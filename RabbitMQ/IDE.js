const amqp = require("amqplib");
var input = connect();
console.log(input)
async function connect(){
    var f_output = "";
    try{
        const connnection = await amqp.connect("amqp://localhost:5672")
        const channel = await connnection.createChannel();
        // make sure queue exit if not will create one
        const result1 = channel.assertQueue("jobs");
        const result2 = channel.assertQueue("testcases");
        // send to queue
        // channel.sendToQueue("jobs", Buffer.from(JSON.stringify(msg)))
        channel.consume("testcases",message => {
            f_output = JSON.parse(message.content.toString() );
            console.log(`Recieved job successfully with file ${f_output}`);
            channel.ack(message);
        })
        return f_output;
    }
    catch (ex){
        console.error(ex)
    }
}
// create a connection
