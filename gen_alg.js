const createGeneticAlgorithm = () => {
  /**
   * Creates the next bird generation
   * 'Refills' the empty bird array based on some logic
   */
  function nextGeneration(birds, copyBirds) {
    for (let i = 0; i < copyBirds.length; i++) {
      birds[i] = pickOne(copyBirds);
    }
    copyBirds.length = 0;
  }

  /**
   * Taking the one with the best score
   */
  function pickOne(copyBirds) {
    let bird = copyBirds.reduce((best, bird) => (best.getScore() > bird.getScore() ? best : bird)); //still a reference
    let bestBird = bird.copy(bird.getBrain());
    bestBird.mutate();

    //TODO: here I need to mutate!
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
