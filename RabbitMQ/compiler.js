const amqp = require("amqplib");

// json object
const f_name = process.argv[2]
connect();
async function connect(){
    try{
        const connnection = await amqp.connect("amqp://localhost:5672")
        const channel = await connnection.createChannel();
        // make sure queue exit if not will create one
        const result1 = channel.assertQueue("jobs");
        const result2 = channel.assertQueue("testcases");
        const {exec} = require("child_process");
        exec(`g++ ${f_name}.cpp -o ${f_name}`, (error, stdout, stderr) => {
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
            console.log(`stdout: Success`);
            channel.sendToQueue("jobs", Buffer.from(JSON.stringify(f_name)))
            return;
        });
        // send to queue
    }
    catch (ex){
        console.error(ex)
    }
}

