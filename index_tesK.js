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
  const distance = [];
  const length = Object.keys(testInstance).length - 1; // length = 5, dikurang 1 biar 4
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
  for (let i = 0; i < testSet.length; i += 1) {
    if (testSet[i].field6 === predictions[i]) {
      correct += 1;
    }
  }
  return (correct / testSet.length) * 100.0;
}

// const testSet = [TRAIN_SET[1], TRAIN_SET[2], TRAIN_SET[3]];
// const predictions = [TRAIN_SET[1], TRAIN_SET[2], TRAIN_SET[3]];
// const accuracy = getAccuracy(testSet, predictions);
// console.log(`${accuracy}%`);

const dataK = [];
for (let z = 1; z < 500; z += 1) {
  let totalAccuracy = 0;
  for (let j = 0; j < 8; j += 1) {
    const TRAINING_SET = [];
    const TRAINING_TESTSET = [];

    loadDataSet(0.6789, TRAINING_SET, TRAINING_TESTSET);
    const predictions = [];
    const k = z;
    for (let i = 0; i < TRAINING_TESTSET.length; i += 1) {
      const neighbors = getNeighbors(TRAINING_SET, TRAINING_TESTSET[i], k);
      const result = getResponse(neighbors);
      predictions.push(result);
      // console.log(`> predicted= ${result}, actual= ${TRAINING_TESTSET[i].field6}, berita=${TRAINING_TESTSET[i].field1} `);
    }

    const accuracy = getAccuracy(TRAINING_TESTSET, predictions);
    // fs.writeFile('predictions_noCluster.json', JSON.stringify(predictions), () => {
    //   console.log('done');
    // });
    console.log(`----k=${k}, Accuracy: ${accuracy}%`);
    // console.log(TRAINING_SET.length);
    // console.log(TRAINING_TESTSET.length);
    totalAccuracy += accuracy;
  }
  const tmpK = {
    k: z,
    accuracy: totalAccuracy / 8,
  };
  console.log(tmpK);
  dataK.push(tmpK);
}
fs.writeFile('index_K.json', JSON.stringify(dataK), () => {
  console.log('DONE!');
});
console.timeEnd('ai-helmi');
