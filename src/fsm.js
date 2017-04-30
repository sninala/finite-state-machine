class FSM {
	/**
	 * Creates new FSM instance.
	 * @param config
	 */
	constructor(config) {
		if (!config) {
			throw Error('Config is not provided');
		}
		this.config = config;
		this.states = this.config.states;
		this.activeStateName = config.initial;
		this.previousState = config.initial;
		this.nextState = config.initial;
	}

	/**
	 * Returns active state.
	 * @returns {String}
	 */
	getState() {
		return this.activeStateName;
	}

	/**
	 * Goes to specified state.
	 * @param state
	 */
	changeState(state) {
		if (!this.states[state]){
			throw Error('State doesn\'t exist');
		}
		this.activeStateName = state;
        this.nextState = state;
	}

	/**
	 * Changes state according to event transition rules.
	 * @param event
	 */
	trigger(event) {
		var currentState = this.states[this.activeStateName],
			newStateName = currentState.transitions[event];
		
		if (!newStateName){
			throw Error('Event doesn\'t exist');
		}
        this.previousState = this.activeStateName;
		this.changeState(newStateName);
	}

	/**
	 * Resets FSM state to initial.
	 */
	reset() {
		this.activeStateName = this.config.initial;
	}

	/**
	 * Returns an array of states for which there are specified event transition rules.
	 * Returns all states if argument is undefined.
	 * @param event
	 * @returns {Array}
	 */
	getStates(event) {
		var allStates = Object.keys(this.states),
			possibleStates,
			that = this;
		
		if (!event) {
			possibleStates = allStates;
		} else {
			possibleStates = allStates.filter(function(stateName) {
				return that.states[stateName].transitions[event];
			});
		}
		
		return possibleStates;
	}

	/**
	 * Goes back to previous state.
	 * Returns false if undo is not available.
	 * @returns {Boolean}
	 */
	undo() {
		var result;
		if((this.activeStateName === this.config.initial && this.previousState == this.activeStateName) || !this.previousState){
			result = false;
		} else{
			this.activeStateName = this.previousState;
			result = true;
		}
		return result;
	}

	/**
	 * Goes redo to state.
	 * Returns false if redo is not available.
	 * @returns {Boolean}
	 */
	redo() {
	    var result = false;
	    if ((this.activeStateName === this.config.initial && this.nextState == this.activeStateName) ||
	        this.nextState == this.activeStateName || !this.nextState) {
	        result = false;
	    } else {
	        this.activeStateName = this.nextState;
	        result = true;
	    }
	    return result;
	}
	/**
	 * Clears transition history
	 */
	clearHistory() {
        this.previousState = null;
		this.nextState = null;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
