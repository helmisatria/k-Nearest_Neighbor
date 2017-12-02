# k - Nearest Neighbor

k-nearest neighbors algorithm (k-NN) is a non-parametric method used for classification and regression. 

In both cases, the input consists of the k closest training examples in the feature space. The output depends on whether k-NN is used for classification or regression:

## INFO

This program used k = **91**, obtained from iterating k from 0 to 800 and for each k iterated 10 times. Below I give you the TOP of 5 accuration from 0 to 800.
```
  {
    "k": 131,
    "accuracy": 70.41355063847958
  },
  {
    "k": 493,
    "accuracy": 70.43988466126974
  },
  {
    "k": 92,
    "accuracy": 70.47087904931294
  },
  {
    "k": 91,
    "accuracy": 70.54724161733023
  },
  {
    "k": 376,
    "accuracy": 70.65572241537595
  }
```
91 chosen because after 2 times trying, it is the most optimal and stable
## Getting Started

These instructions will get you a copy of the project up and running on your local machine for testing purposes. See 'Running Instruction' for notes on how to deploy the project on a live system.

### Prerequisites
What things you need to install the software

- Node JS
- Node Package Manager (npm)

### Installing

```
npm install
```
## Running Instruction

```
node .
```
```
npm start
```
### If you prefer using yarn
```
yarn start
```

## Result would be printed on 2 files:
- Final_Result.csv
- Final_Result.json

## Authors 

- **Helmi Satria**
