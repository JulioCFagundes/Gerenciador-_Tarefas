const express = require('express');
const cors = require('cors');

// const { v4: uuidv4 } = require('uuid');

const app = express();
const users = []
const { v4: uuidv4 } = require("uuid");
const req = require('express/lib/request');
app.use(cors());
app.use(express.json());


// const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers
  const user = users.find(user => user.username === username)

  if (!user) {
    return response.status(400).json({ error: ' usuário não encontrado!' })
  }

  request.user = user
  return next()
}

app.post('/users', (request, response) => {
  const { username } = request.body;
  const user = {
    username,

    tarefas: []
  }
  users.push(user)


  return response.status(201).send()

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username, user } = request
  return response.json(user.tarefas)

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request

  let { title, deadline } = request.body
  deadline = new Date(deadline)
  const tarefa = {
    id: uuidv4(),
    title,
    done: false,
    deadline,
    created_at: new Date()

  }

  user.tarefas.push(tarefa)

  return response.status(201).send()
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request

  const { title, deadline } = request.body



  function getIndex() {
    const id1 = request.params.id

    for (i = 0; i < user.tarefas.length; i++) {
      if (user.tarefas[i].id === id1) {
        user.tarefas[i].title = title
        user.tarefas[i].deadline = new Date(deadline)
      }
    }
  }
  getIndex()


  return response.status(201).send()







});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request
  const id = request.params.id
  function getIndex2() {
    const id1 = request.params.id

    for (i = 0; i < user.tarefas.length; i++) {
      if (user.tarefas[i].id === id1) {
        user.tarefas[i].done = true
      }
    }
  }
  getIndex2()
  return response.status(201).send()
})
app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request
  const id1 = request.params.id
  function getIndex3() {


    for (i = 0; i < user.tarefas.length; i++) {
      if (user.tarefas[i].id === id1) {
        user.tarefas.splice(i, 1)
      }
    }
  }
  getIndex3()

  return response.status(201).send()
});

module.exports = app;