const {Socket} = require('net');
const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});
const END = 'END';

const error = (err) => {
	console.error(err);
	process.exit(1);
};

const connect = (host, port) => {
	const socket = new Socket();
	socket.setEncoding('utf-8');
	socket.connect({host, port});
	
	socket.on("connect", () => {
		readline.question("Write your username: ", (username) => {
			socket.write(username);
			console.log(`Type any message to send it, type ${END} to finish`);
		});
		readline.on("line", (message) => {
			socket.write(message);
			if (message === END)
			{
				console.log("Disconnected");
				socket.end();
			}
		});
	});
	socket.on("data", (data) => {
		console.log(data);
	});
	socket.on("close", () => {
		process.exit(0);
	});
	socket.on("error", (err)=> error(err.message));
};
const main = () => {
	if (process.argv.length !== 4)
	{
		error(`Usage: node ${__filename} host port`);
	}
	let [,,host, port] = process.argv;
	if (isNaN(port))
	{
		error(`Invalid port ${port}`);
	}
	port = Number(port);
	connect(host, port);
};
if (require.main === module)
{
	main();
}