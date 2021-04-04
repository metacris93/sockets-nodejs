const { Server } = require('net');
const server = new Server();
const END = 'END';
const host = "0.0.0.0";
const error = (err) => {
	console.error(err);
	process.exit(1);
};
const connections = new Map();
/*
127.0.0.1:5600 -> Juan
127.0.0.1:5601 -> Jose
127.0.0.1:5602 -> Javier
*/
const sendMessage = (message, origin) => {
	//enviar a todos menos a origin el message
	for(const socket of connections.keys())
	{
		if (socket !== origin)
		{
			socket.write(message);
		}
	}
};

const listen = (port) => {
	server.on("connection", (socket) => {
		const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`;
		console.log(`New connection from ${remoteSocket}`);
		socket.setEncoding('utf-8');
		socket.on("data", (message) => {
			if (!connections.has(socket))// es el primer mensaje y viene el nombre de usuario
			{
				console.log(`Username ${message} set for connection ${remoteSocket}`)
				connections.set(socket, message);
			}
			else if (message === END)
			{
				connections.delete(socket);
				socket.end();
			}
			else
			{
				const fullMessage = `[${connections.get(socket)}]: ${message}`;
				console.log(`${remoteSocket} -> ${fullMessage}`);
				sendMessage(fullMessage, socket);
			}
		});
		socket.on("close", ()=> {
			connections.
			console.log(`Connection with ${remoteSocket} closed`);
		});
		socket.on("error", (err)=> error(err.message));
	});
	/*
	establecemos host con 0.0.0.0 para no mezclar ipv4 con ipv6
	*/
	server.listen( { port, host }, () => {
		console.log("listening on port " + port);
	});
	server.on("error", (err) => error(err.message));
};

const main = () => {
	if (process.argv.length !== 3)
	{
		error(`Usage: node ${__filename} port`);
	}
	let port = process.argv[2];
	if (isNaN(port))
	{
		error(`Invalid port ${port}`);
	}
	port = Number(port);
	listen(port);
};
if (require.main === module)
{
	main();
}
