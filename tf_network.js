'use strict';

const createNetwork = (nInput_classes, nOutput_classes, _model) => {
  let model;

  if (_model instanceof tf.Sequential) {
    model = _model;
  } else {
    model = createModel();
  }

  function copy() {
    return tf.tidy(() => {
      const modelCopy = createModel();
      const weights = model.getWeights();
      const weightCopies = [];
      for (let i = 0; i < weights.length; i++) {
        weightCopies[i] = weights[i].clone();
      }
      modelCopy.setWeights(weightCopies);
      let newBrain = createNetwork(nInput_classes, nOutput_classes, modelCopy);
      return newBrain;
    });
  }

  function mutate(rate, fitness) {
    // The idea is, that fitter birds, mutate less
    const scale = utils.map(utils.getRandomArbitrary(0, 1 / fitness), 0, 50, 0, 1);
    tf.tidy(() => {
      const weights = model.getWeights();
      const mutatedWeights = [];
      for (let i = 0; i < weights.length; i++) {
        let tensor = weights[i];
        let shape = weights[i].shape;
        let values = tensor.dataSync().slice();
        for (let j = 0; j < values.length; j++) {
          if (Math.random() < rate) {
            values[j] += scale * Math.random() * utils.randomGaussian(); // ??? :(
            //values[j] += Math.random() * utils.randomGaussian();
            //values[j] += utils.randomGaussian();
          }
        }
        let newTensor = tf.tensor(values, shape);
        mutatedWeights[i] = newTensor;
      }
      model.setWeights(mutatedWeights);
    });
  }

  function dispose() {
    model.dispose();
  }

  function predict(xs) {
    return tf.tidy(() => {
      //const xs = tf.tensor2d([inputs]);
      //const ys = model.predict(xs);
      const ys = model.predict(xs);
      const outputs = ys.dataSync();
      // console.log(outputs);
      return outputs;
    });
  }

  function createModel() {
    const newModel = tf.sequential();
    newModel.add(
      tf.layers.dense({
        inputShape: [nInput_classes],
        units: 5 * nInput_classes,
        kernelInitializer: 'RandomNormal',
        activation: 'sigmoid',
      })
    );
    newModel.add(
      tf.layers.dense({
        units: nOutput_classes,
        activation: 'softmax',
      })
    );

    return newModel;
  }

  return {
    copy,
    mutate,
    dispose,
    predict,
  };
};
