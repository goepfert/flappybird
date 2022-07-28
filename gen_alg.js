/**
 * Creates a new genetic algorithm for bird generation, survival of the fittest
 */

'use strict';

const createGeneticAlgorithm = () => {
  let n_gen = 0;

  /**
   * Creates the next bird generation
   */
  function nextGeneration(birds, copyBirds) {
    console.log(`--- nextGen: ${n_gen++} -----------------------------`);

    calculateFitness(copyBirds);
    for (let i = 0; i < N_BIRDS; i++) {
      birds[i] = pickOne(copyBirds, true);
    }

    // I want to keep the best candidate (e.g. if next generation is a complete fail und not worth to replicate ... ;))
    let bestBird = pickBest(copyBirds, false);

    // Clean up tf models
    copyBirds.forEach((bird) => {
      bird.dispose();
    });

    copyBirds.length = 0;
    copyBirds.push(bestBird); // Save the best

    return n_gen;
  }

  /**
   * Returns a new bird with copied brain with best fitness from bird array
   */
  function pickBest(copyBirds, doMutate = true) {
    let maxFitness = -1;
    let bird;

    for (let index = 0; index < copyBirds.length; index++) {
      let fitness = copyBirds[index].getFitness();
      if (fitness > maxFitness) {
        maxFitness = fitness;
        bird = copyBirds[index];
      }
    }

    let child = createBird(bird.getBrain());
    child.setScore(bird.getScore());
    child.setFitness(bird.getFitness());

    if (doMutate) {
      child.mutate(0.1, bird.getFitness());
    }
    return child;
  }

  /**
   * Returns a new bird with copied brain selected with fitness prob from bird array
   */
  function pickOne(copyBirds, doMutate = true) {
    let index = 0;
    let r = Math.random();
    while (r > 0) {
      r = r - copyBirds[index].getFitness();
      index++;
    }
    index--;

    let bird = copyBirds[index];
    let child = createBird(bird.getBrain());

    if (doMutate) {
      child.mutate(0.1, bird.getFitness());
    }
    return child;
  }

  /**
   * Normalize the score of all birds
   * Let's call it fitness
   */
  function calculateFitness(birds) {
    let sum = 0;
    for (let i = 0; i < birds.length; i++) {
      // respect for beeing closer to the opening than other birds
      let score = birds[i].getScore();
      let closestGate = birds[i].getClosestGate();
      if (closestGate != 0) {
        closestGate = utils.map(closestGate, 0, GAME_HEIGHT, 1, 0);
      }
      // console.log('🚀 ~ file: gen_alg.js ~ line 86 ~ calculateFitness ~ closestGate', i, closestGate);

      birds[i].setScore(score + closestGate);

      sum += birds[i].getScore();
    }
    // Divide by the sum
    for (let i = 0; i < birds.length; i++) {
      birds[i].setFitness(birds[i].getScore() / sum);
      // console.log('🚀 ~ file: gen_alg.js ~ line 95 ~ calculateFitness ~ birds[i].getFitness();', birds[i].getFitness());
    }
  }

  return {
    nextGeneration,
  };
};
