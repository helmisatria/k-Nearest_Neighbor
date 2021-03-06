console.time('ai-helmi');
const TRAIN_SET = require('./TRAIN_SET.json');
const TEST_SET = require('./TEST_SET.json');
const fs = require('fs');

const TRAINING_LENGTH = 4000;
function loadDataSet(split, trainingSet, testSet) {
  for (let i = 0; i < TRAINING_LENGTH; i += 1) {
    if (Math.random() < split) {
      trainingSet.push(TRAIN_SET[i]);
    } else {
      testSet.push(TRAIN_SET[i]);
    }
  }
}

function euclideanDistance(instance1, instance2, length) {
  let distance = 0;
  for (let i = 0; i < length; i += 1) {
    distance += (instance1[`field${i + 2}`] - instance2[`field${i + 2}`]) ** 2;
  }
  return Math.sqrt(distance);
}

// distance = euclideanDistance(TRAIN_SET[1], TRAIN_SET[2], 4);
// console.log(`Distance: ${distance}`);

function getNeighbors(trainingSet, testInstance, k) {
  // console.log(testInstance);
  const distance = [];
  const length = Object.keys(testInstance).length; // length = 5, dikurang 1 biar 4
  // console.log({ length });
  for (let i = 0; i < trainingSet.length; i += 1) {
    const dist = euclideanDistance(testInstance, trainingSet[i], length - 1);
    distance.push([trainingSet[i], dist]);
  }
  distance.sort((a, b) => a[1] - b[1]);
  const neighbors = [];
  for (let y = 0; y < k; y += 1) {
    neighbors.push(distance[y][0]);
  }
  return neighbors;
}

// const ktest = 1;
// const neighbors = getNeighbors([TRAIN_SET[2], TRAIN_SET[3]], TRAIN_SET[3], ktest);

function getResponse(neighbors) {
  const hoax = {
    1: 0,
    0: 0,
  };

  for (let i = 0; i < neighbors.length; i += 1) {
    const response = neighbors[i].field6; // Hoax = 1 | = 0
    if (response === '1') {
      hoax[1] += 1;
    } else {
      hoax[0] += 1;
    }
  }
  if (hoax[0] > hoax[1]) {
    return '0';
  }
  return '1';
}

// const neighbors = [TRAIN_SET[1], TRAIN_SET[2], TRAIN_SET[3]];
// const response = getResponse(neighbors);
// console.log(neighbors);
// console.log(response);

function getAccuracy(testSet, predictions) {
  let correct = 0;
  let position = 0;
  Object.keys(predictions).forEach((predict) => {
    for (let j = 0; j < predictions[predict].length; j += 1) {
      if (testSet[position].field6 === predictions[predict][j]) {
        correct += 1;
      }
      position += 1;
    }
  });
  console.log({ position });
  return (correct / testSet.length) * 100.0;
}

// const testSet = [TRAIN_SET[1], TRAIN_SET[2], TRAIN_SET[3]];
// const predictions = [TRAIN_SET[1], TRAIN_SET[2], TRAIN_SET[3]];
// const accuracy = getAccuracy(testSet, predictions);
// console.log(`${accuracy}%`);


const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

// numCPUs = 9;

const TRAINING_SET = TRAIN_SET;
const TRAINING_TESTSET = TRAIN_SET;

// const TRAINING_SET = [];
// const TRAINING_TESTSET = [];

// loadDataSet(0.5, TRAINING_SET, TRAINING_TESTSET);

const separate = [];
for (let i = 0; i <= numCPUs; i += 1) {
  separate.push(Math.floor(((i) * TRAINING_TESTSET.length) / numCPUs));
}

if (cluster.isMaster) {
  console.log({ separate });
  console.log(`Master ${process.pid} is running`);
  let predictions = {};
  let count = 0;

  // Fork workers.
  for (let i = 0; i < numCPUs; i += 1) {
    const worker = cluster.fork();

    worker.on('message', (message) => {
      if (message.type === 'data') {
        predictions = { ...predictions, ...message.data };
        count += 1;
      }
      if (count === 8) {
        // fs.writeFile('predictions.json', JSON.stringify(predictions), () => {
        //   console.log('done');
        // });
        const accuracy = getAccuracy(TRAINING_TESTSET, predictions);
        console.log(`Accuracy: ${accuracy}%`);
        console.timeEnd('ai-helmi');
      }
    });
  }
} else {
  const clusterID = cluster.worker.id;
  // loadDataSet(0.5, TRAINING_SET, TRAINING_TESTSET);

  const predictionsWorker = [];
  const k = 51;
  for (let i = separate[clusterID - 1]; i < separate[clusterID]; i += 1) {
    const neighbors = getNeighbors(TRAINING_SET, TRAINING_TESTSET[i], k);
    const result = getResponse(neighbors);

    predictionsWorker.push(result);
    // console.log(`> predicted= ${result}, actual= ${TRAINING_TESTSET[i].field6}, berita=${TRAINING_TESTSET[i].field1} `);
  }
  process.send({ type: 'data', data: { [`${clusterID}`]: predictionsWorker } });
}
