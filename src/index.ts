// GRPC is used in COSMOS Blockchain for this you will have to use Proto
// Cosmos SDk
// GATHERTOWN uses ProtoBufs and GRPC Mainly
import path from 'path';
import * as grpc from '@grpc/grpc-js';
import  { GrpcObject, ServiceClientConstructor } from "@grpc/grpc-js"
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './generated/a';
import { AddressBookServiceHandlers } from './generated/AddressBookService';
import { Status } from '@grpc/grpc-js/build/src/constants';

const packageDefinition = protoLoader.loadSync(path.join(__dirname, './a.proto'));
const personProto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType; // Loads Proto  File
const PERSONS = [
    {
        name: "harkirat",
        age: 45
    },
    {
      name: "raman",
      age: 45
    },
];

// //@ts-ignore
// //  call => Req
// // callback => Res.json()
// function addPerson(call, callback) {
//   console.log(call)
//     let person = {
//       name: call.request.name,
//       age: call.request.age
//     }
//     PERSONS.push(person);
//     callback(null, person) // Error first callbacks, if there is no error then use null else use err
// }

// //@ts-ignore
// function GetPersonByName(call, callback) {
//   const name = call.request.name;
//   const person = PERSONS.find(x => x.name === name);
//   callback(null, person);

// }


const handler: AddressBookServiceHandlers =  {
    AddPerson: (call, callback) => {
      let person = {
        name: call.request.name,
        age: call.request.age
      }
      PERSONS.push(person);
      callback(null, person)
    },
    GetPersonByName: (call, callback) => {
      let person = PERSONS.find(x => x.name === call.request.name);
      if (person) {
        callback(null, person)
      } else {
        callback({
          code: Status.NOT_FOUND,
          details: "not found"
        }, null);
      }
    }
  }
// const app = express()
const server = new grpc.Server();

// server.addService((personProto.AddressBookService as ServiceClientConstructor).service, 
// { addPerson: addPerson,
//   GetPersonByName: GetPersonByName  }); // Type assesrtion was done here
// server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
//     server.start();
// });


server.addService((personProto.AddressBookService).service, handler);
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
});