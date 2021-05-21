const amqp = require("amqplib");
connect();
async function connect(){
    try{
        const connnection = await amqp.connect("amqp://localhost:5672")
        const channel = await connnection.createChannel()
        // make sure queue exit if not will create one
        const result1 = channel.assertQueue("jobs");
        const result2 = channel.assertQueue("testcases");
        const {exec} = require("child_process");
        channel.consume("jobs",message => {
            const f_name = JSON.parse(message.content.toString() );
            console.log(`Recieved job successfully with file ${f_name}`);
            exec(`./${f_name} < input.txt`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    channel.sendToQueue("testcases", Buffer.from(JSON.stringify(error.message)))
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    channel.sendToQueue("testcases", Buffer.from(JSON.stringify(stderr)))
                    return;
                }
                console.log(`stdout: ${stdout}`);
                channel.sendToQueue("testcases", Buffer.from(JSON.stringify(stdout)))
            });
            channel.ack(message)
        })
        console.log("Waiting for msgs....")
    }
    catch (ex){
        console.error(ex)
    }
}

// sudo docker run --name rabbitmq -p 5672:5672 rabbitmq
// sudo docker run -d rabbitmq -p 5672:5672 rabbitmq
// sudo docker run -p 5672:5672 rabbitmq