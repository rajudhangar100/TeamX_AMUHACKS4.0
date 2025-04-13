export class QLearning {
    constructor(alpha = 0.3, gamma = 0.9, epsilon = 0.2, minEpsilon = 0.01, decayRate = 0.95) {
      this.qTable = {};
      this.alpha = alpha; // Learning rate
      this.gamma = gamma; // Discount factor
      this.epsilon = epsilon; // Exploration rate
      this.minEpsilon = minEpsilon;
      this.decayRate = decayRate;
    }
  
    getStateKey(score, attempts) {
      const accuracy = attempts > 0 ? Math.floor((score / attempts) * 100) : 0;
      const accuracyBucket = Math.floor(accuracy / 20) * 20;
      return `accuracy:${accuracyBucket}`;
    }
  
    getActions() {
      return ['easy', 'medium', 'hard'];
    }
  
    getAllowedActions(current) {
      const actions = this.getActions();
      if (current === 'medium') {
        return ['easy', 'medium', 'hard'];
      } else if (current === 'easy') {
        return ['easy', 'medium'];
      } else {
        return ['medium', 'hard'];
      }
    }
  
    getNextAction(score, attempts, currentDifficulty) {
      const stateKey = this.getStateKey(score, attempts);
      const allowedActions = this.getAllowedActions(currentDifficulty);
      const accuracy = attempts > 0 ? (score / attempts) * 100 : 0;
  
      if (!this.qTable[stateKey]) {
        this.qTable[stateKey] = {};
        allowedActions.forEach(action => {
          this.qTable[stateKey][action] = 0;
        });
      }
  
      if (accuracy >= 80) {
        if (currentDifficulty === 'easy') return 'medium';
        if (currentDifficulty === 'medium') return 'hard';
        return 'hard';
      } else if (accuracy <= 40) {
        if (currentDifficulty === 'hard') return 'medium';
        if (currentDifficulty === 'medium') return 'easy';
        return 'easy';
      }
  
      if (Math.random() < this.epsilon) {
        return allowedActions[Math.floor(Math.random() * allowedActions.length)];
      }
  
      let bestAction = currentDifficulty;
      let maxQ = -Infinity;
  
      allowedActions.forEach(action => {
        const q = this.qTable[stateKey][action] || 0;
        if (q > maxQ) {
          maxQ = q;
          bestAction = action;
        }
      });
  
      console.log(`State: ${stateKey}, Accuracy: ${accuracy}%, Next difficulty: ${bestAction}`);
      return bestAction;
    }
  
    update(score, attempts, action, reward, newScore, newAttempts) {
      const stateKey = this.getStateKey(score, attempts);
      const newStateKey = this.getStateKey(newScore, newAttempts);
      const accuracy = attempts > 0 ? (score / attempts) * 100 : 0;
  
      let adjustedReward = reward;
      if (accuracy >= 80) {
        adjustedReward *= 2;
      } else if (accuracy <= 40) {
        adjustedReward *= 0.5;
      }
  
      if (!this.qTable[stateKey]) {
        this.qTable[stateKey] = {};
        this.getActions().forEach(a => {
          this.qTable[stateKey][a] = 0;
        });
      }
  
      if (!this.qTable[newStateKey]) {
        this.qTable[newStateKey] = {};
        this.getActions().forEach(a => {
          this.qTable[newStateKey][a] = 0;
        });
      }
  
      const oldQ = this.qTable[stateKey][action] || 0;
      const maxFutureQ = Math.max(...Object.values(this.qTable[newStateKey]));
      const newQ = oldQ + this.alpha * (adjustedReward + this.gamma * maxFutureQ - oldQ);
  
      this.qTable[stateKey][action] = newQ;
      this.epsilon = Math.max(this.minEpsilon, this.epsilon * this.decayRate);
  
      console.log(`Updated Q-value for ${action} at accuracy ${accuracy}%: ${newQ.toFixed(2)}`);
    }
  }
  
  export const qModel = new QLearning();
  