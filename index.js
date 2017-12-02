console.time('ai-helmi');
const TRAIN_SET = require('./TRAIN_SET.json');
const TEST_SET = require('./TEST_SET.json');
const fs = require('fs');
const json2csv = require('json2csv');

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
    // console.log({ [`field${i+2}`]: instance1[`field${i + 2}`] });
    distance += (instance1[`field${i + 2}`] - instance2[`field${i + 2}`]) ** 2;
  }
  return Math.sqrt(distance);
}

// distance = euclideanDistance(TRAIN_SET[1], TRAIN_SET[2], 4);
// console.log(`Distance: ${distance}`);

function getNeighbors(trainingSet, testInstance, k) {
  const distance = [];
  // console.log({ length });
  for (let i = 0; i < trainingSet.length; i += 1) {
    const length = Object.keys(testInstance).length - 1; // length = 5, dikurang 1 biar 4
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
  const result = testSet;
  let correct = 0;
  for (let i = 0; i < testSet.length; i += 1) {
    if (testSet[i].field6 === predictions[i]) {
      correct += 1;
    }
    result[i].field6 = predictions[i];
  }
  fs.writeFile('Final_Result.json', JSON.stringify(result), () => {
    console.log('FINISH!');
  });
  const fields = ['Berita', 'Like', 'Provokasi', 'Komentar', 'Emosi', 'Hoax'];
  const csv = json2csv({ data: result, fieldNames: fields });

  fs.writeFile('Final_Result.csv', csv, () => {
    console.log('FILE SAVED!');
  });
  return (correct / testSet.length) * 100.0;
}

// const TRAINING_SET = [];
// const TRAINING_TESTSET = [];

const TRAINING_SET = TRAIN_SET;
const TRAINING_TESTSET = TEST_SET;

// loadDataSet(0.7, TRAINING_SET, TRAINING_TESTSET);

const predictions = [];
const k = 91;
for (let i = 0; i < TRAINING_TESTSET.length; i += 1) {
  const neighbors = getNeighbors(TRAINING_SET, TRAINING_TESTSET[i], k);
  const result = getResponse(neighbors);
  predictions.push(result);
  console.log(`> predicted= ${result}, berita=${TRAINING_TESTSET[i].field1} `);
  // console.log(`> predicted= ${result}, actual= ${TRAINING_TESTSET[i].field6}, berita=${TRAINING_TESTSET[i].field1} `);
}

const accuracy = getAccuracy(TRAINING_TESTSET, predictions);
// console.log(`Accuracy: ${accuracy}%`);
// console.log(TRAINING_SET.length);
// console.log(TRAINING_TESTSET.length);

console.timeEnd('ai-helmi');
