'use strict';

var good = require('good')
  , hapi = require('hapi')
  , joi = require('joi')
  , server = new hapi.Server(3000)
  , mockUsers = [
    {
      name: 'abe'
    }, {
      name: 'mary'
    }, {
      name: 'todd'
    }, {
      name: 'lincoln'
    }
  ];

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply('Hello, world!');
  }
});

server.route({
  method: 'GET',
  path: '/mockUsers/{id?}',
  handler: function (request, reply) {
    if (request.params.id) {
      if (mockUsers.length <= request.params.id) {
        return reply('No mock user found.').code(404);
      }
      return reply(mockUsers[request.params.id]);
    }
    reply(mockUsers);
  }
});

server.route({
  method: 'POST',
  path: '/mockUsers',
  config: {
    handler: function (request, reply) {
      var newMockUser = {
        name: request.payload.name
      };
      mockUsers.push(newMockUser);
      reply(newMockUser);
    },
    validate: {
      payload: {
        name: joi.string().required().min(3).max(10)
      }
    }
  }
});

server.route({
  method: 'DELETE',
  path: '/mockUsers/{id}',
  handler: function (request, reply) {
    if (mockUsers.length <= request.params.id) {
      return reply('No mock user found.').code(404);
    }
    mockUsers.splice(request.params.id, 1);
    reply(true);
  }
});

server.pack.register(good, function (err) {
  if (err) {
    throw err;
  }

  server.start(function () {
    console.log('Server running at:', server.info.uri);
  });
});