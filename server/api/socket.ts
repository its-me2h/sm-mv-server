
export function socketManager(io: any) {

	// Store active activeRooms information in an object
	const activeRooms: any = {};

	const users: any = {};

	const socketToRoom: any = {};

	io.on("connection", (socket: any) => {



		console.log("User connected");
	
		
		socket.on("getSocketId", () => {
			socket.emit("socketId", socket.id);
		})
		
	
		socket.on("joinRoom", (data: any) => {

			// Extract user data from the received payload
			const { roomId, id, role, firstName, lastName, img } = data;
		
			// Check if the room with the given roomId exists
			if (!activeRooms[roomId]) {
				// If the room doesn't exist, create it and add the user as the host
				activeRooms[roomId] = {
					users: [
						{
							host: true,
							id,
							role,
							firstName,
							lastName,
							img,
							socketId: socket.id
						}
					]
				};
			} else {
				// If the room already exists, add the user to the user list
				activeRooms[roomId].users.push({
					id,
					role,
					firstName,
					lastName,
					img,
					socketId: socket.id
				});

				// Filter out the current socket user and emit updated user list
				const roomUsers = activeRooms[roomId].users.filter((user: any) => user.socketId !== socket.id);
				console.log("emit room users")
				socket.emit("roomUsers", roomUsers);
			}
		
			// Join the user to the specified room
			socket.join(roomId);
		
			// Log the "joinRoom" event and room details for debugging
			console.log("joinRoom");
			console.log(activeRooms);
			console.log("#######");
			console.log(activeRooms[roomId]);
		});





		




























	

		// When the "peerOffer" event is received from the socket
		socket.on("peerOffer", (data: any) => {

			console.log('peer offer calleeId')
			console.log(data.calleeId)

			// Extract variables
			const { calleeId, signalOffer } = data;

			
			// Emit a 'user joined' event to the callee with request signal and caller ID
			io.to(calleeId).emit("newPeerOffer", { signalOffer, callerId: socket.id });

		});



		// When the "peerAnswer" event is received from the socket
		socket.on("peerAnswer", (data: any) => {

			console.log('peer answer callerId')
			console.log(data.callerId)

			// Destructure data object to extract variables
			const { signalAnswer, callerId } = data;

			// Emit a 'receiving returned signal' event to the caller with response signal and callee ID
			io.to(callerId).emit("newPeerAnswer", { signalAnswer, calleeId: socket.id });

		});
		


















	// 	// When the user disconnects
	socket.on("disconnect", () => {

		// Find the room the user was in
		for (const roomId in activeRooms) {


			const room = activeRooms[roomId];
			const userIndex = room.users.findIndex((user: any) => user.socketId === socket.id);

			if (userIndex !== -1) {
				const user = room.users[userIndex];
				room.users.splice(userIndex, 1); // Remove the user from the room

				if (user.host) {
					// If the user was the host, remove the room and emit to all users in the room
					delete activeRooms[roomId];
					io.to(roomId).emit("hostEndedCall");
					console.log('hostEndedCall')
				} else {
					// If the user was not the host, emit to all users in the room that a user left
					io.to(roomId).emit("userLeft", { userId: user.id });
					console.log('userLeft')
				}

				if (room.users.length === 0) {
					// If the room is empty, remove it from the activeRooms object
					delete activeRooms[roomId];
				}
			}
		}
	});

















	});
	

	// io.on('connection', (socket: any) => {


	// 	socket.on("join room", (roomID: string) => {
	// 		if (users[roomID]) {
	// 			const length = users[roomID].length;
	// 			if (length === 4) {
	// 				socket.emit("room full");
	// 				return;
	// 			}
	// 			users[roomID].push(socket.id);
	// 		} else {
	// 			users[roomID] = [socket.id];
	// 		}
	// 		socketToRoom[socket.id] = roomID;
	// 		const usersInThisRoom = users[roomID].filter((id: any) => id !== socket.id);
	
	// 		socket.emit("all users", usersInThisRoom);
	// 	});


	
	// 	socket.on("sending signal", (payload: any) => {
	// 		io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
	// 	});
	
	// 	socket.on("returning signal", (payload: any) => {
	// 		io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
	// 	});
	
	// 	socket.on('disconnect', () => {
	// 		const roomID = socketToRoom[socket.id];
	// 		let room = users[roomID];
	// 		if (room) {
	// 			room = room.filter((id: any) => id !== socket.id);
	// 			users[roomID] = room;
	// 		}
	// 	});
	// });
};
	