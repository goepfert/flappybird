/**
 * Creates the neural network (birds brain)
 * Provides essential operations on that brain like thinking (predict) copy and mutation
 */

'use strict';

const createNetwork = (nInput_classes, nOutput_classes, _model) => {
  let model;

  // check if parameter is defined
  if (_model instanceof tf.Sequential) {
    model = _model;
  } else {
    model = createModel();
  }

  /**
   * Returns a real deep copy of the model/brain
   * Creates the same model and copies the weights
   */
  function copy() {
    return tf.tidy(() => {
      const modelCopy = createModel();
      const weights = model.getWeights();
      const weightCopies = []; //actually an array of tensors at the end
      for (let i = 0; i < weights.length; i++) {
        weightCopies[i] = weights[i].clone();
      }
      modelCopy.setWeights(weightCopies);
      let newBrain = createNetwork(nInput_classes, nOutput_classes, modelCopy);
      return newBrain;
    });
  }

  /**
   * Applies sort of mutation to the model/brain
   * Some percent of the model weights are diced randomly
   */
  function mutate(rate, fitness) {
    // The idea is, that fitter birds, mutate less
    const scale = utils.map(utils.getRandomArbitrary(0, 1 / fitness), 0, 50, 0, 1);
    tf.tidy(() => {
      const weights = model.getWeights();
      const mutatedWeights = [];
      for (let i = 0; i < weights.length; i++) {
        let tensor = weights[i];
        let shape = weights[i].shape;
        let values = tensor.dataSync().slice(); //https://github.com/shiffman/Tensorflow-JS-Examples/issues/7
        for (let j = 0; j < values.length; j++) {
          if (Math.random() < rate) {
            values[j] += scale * Math.random() * utils.randomGaussian(); // ??? :(
            //values[j] += Math.random() * utils.randomGaussian();
            //values[j] += utils.randomGaussian();
          }
        }
        const newTensor = tf.tensor(values, shape);
        mutatedWeights[i] = newTensor;
      }
      model.setWeights(mutatedWeights);
    });
  }

  /**
   * Clean up the model by hand
   */
  function dispose() {
    model.dispose();
  }

  /**
   * Do the prediction based on the inputs using the model
   */
  function predict(xs) {
    return tf.tidy(() => {
      //const xs = tf.tensor2d([inputs]);
      //const ys = model.predict(xs);
      const ys = model.predict(xs);
      const outputs = ys.dataSync();
      return outputs;
    });
  }

  /**
   * Build up the tf model
   */
  function createModel() {
    const newModel = tf.sequential();
    newModel.add(
      tf.layers.dense({
        inputShape: [nInput_classes],
        units: 3 * nInput_classes,
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
