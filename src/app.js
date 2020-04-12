const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).send();
  }

  return next()
  
}

app.use("/repositories/:id", validateRepositoryId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const repository = {
    id: uuid(),
    ...request.body,
    likes: 0
  };
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { likes } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if (repositoryIndex < 0) {
    return response.status(400).send();
  }

  if (likes) {
    return response.json({ likes: repositories[repositoryIndex].likes })
  }  

  const repository = {
    ...repositories[repositoryIndex],
    ...request.body
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if (repositoryIndex < 0) {
    return response.status(400).send();
  }

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if (repositoryIndex < 0) {
    return response.status(400).send();
  }

  const repository = repositories[repositoryIndex];
  const likes = repository.likes + 1;

  repositories[repositoryIndex] = {
    ...repository,
    likes
  }

  return response.json({ likes });
});

module.exports = app;
