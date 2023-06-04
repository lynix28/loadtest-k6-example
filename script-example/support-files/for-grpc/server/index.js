/* eslint-disable no-console */
const grpc = require('@grpc/grpc-js');
const PROTO_PATH = './server/testing.proto';
const protoLoader = require('@grpc/proto-loader');

const options = {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true,
};
const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const testProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();
let datas = [
	{ id: '1', firstName: 'Putu', lastName: 'Ganteng', email: 'putu_ganteng@aloha.com' },
	{ id: '2', firstName: 'Made', lastName: 'Bagus', email: 'made_bagus@aloha.com' },
	{ id: '3', firstName: 'Ketut', lastName: 'Ngentut', email: 'ketut_ngentut@aloha.com' }
];

server.addService(testProto.TestService.service, {
	getAllData: (_, callback) => {
		callback(null, { datas: datas });
	},
	getData: (_, callback) => {
		const userId = _.request.id;
		const userItem = datas.find(({ id }) => userId == id);
		callback(null, userItem);
	},
	deleteData: (_, callback) => {
		const userId = _.request.id;
		datas = datas.filter(({ id }) => id != userId);
		callback(null, {});
	},
	editData: (_, callback) => {
		const userId = _.request.id;
		const userItem = datas.find(({ id }) => userId == id);
		userItem.firstName = _.request.firstName;
		userItem.lastName = _.request.lastName;
		userItem.email = _.request.email;
		callback(null, userItem);
	},
	addData: (call, callback) => {
		let _datas = { id: Date.now(), ...call.request };
		datas.push(_datas);
		callback(null, _datas);
	},
});

server.bindAsync(
	'0.0.0.0:50051',
	grpc.ServerCredentials.createInsecure(),
	(error, port) => {
		console.log('Server at port:', port);
		console.log('Server running at 127.0.0.1:50051');
		server.start();

		if (error) {
			console.log('Server cannot start');
		}
	}
);