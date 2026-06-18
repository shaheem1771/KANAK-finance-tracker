(() => {
	// keep JS small: hydrate totals if desired via API
	async function fetchExpenses(){
		try{
			const res = await fetch('/api/expenses');
			if(!res.ok) return;
			const data = await res.json();
			// optional: update UI dynamically in future
			console.debug('loaded', data.length, 'expenses')
		}catch(e){
			console.debug('expenses load failed', e)
		}
	}

	if(window.fetch) fetchExpenses()
	else console.log('Personal Finance Tracker loaded')
})();
