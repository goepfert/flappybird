const createGeneticAlgorithm = () => {
  function nextGeneration(birds, copyBirds) {
    for (let i = 0; i < copyBirds.length; i++) {
      birds[i] = pickOne(copyBirds);
      // console.log(i, birds[i].getScore());
    }

    copyBirds = [];
  }

  function pickOne(copyBirds) {
    let bestBird = copyBirds.reduce((best, bird) => (best.getScore() > bird.getScore() ? best : bird));
    return bestBird;
  }

  // Normalize the fitness of all birds
  function normalizeFitness() {
    // Add up all the scores
    let sum = 0;
    for (let i = 0; i < birds.length; i++) {
      sum += birds[i].score;
    }
    // Divide by the sum
    for (let i = 0; i < birds.length; i++) {
      birds[i].fitness = birds[i].score / sum;
    }
  }

  return {
    nextGeneration,
  };
};
