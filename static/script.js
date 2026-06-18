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
(() => {
	const api = '/api/expenses'

	async function fetchExpenses(){
		try{
			const res = await fetch(api)
			if(!res.ok) throw new Error('fetch failed')
			return await res.json()
		}catch(e){
			console.debug('load failed', e)
			return []
		}
	}

	function addRowToTable(row){
		const tb = document.querySelector('#expensesTable tbody')
		if(!tb) return
		const tr = document.createElement('tr')
		tr.innerHTML = `<td>${row.date}</td><td>${row.category}</td><td class="text-end">$${parseFloat(row.amount).toFixed(2)}</td><td>${row.note || ''}</td>`
		tb.prepend(tr)
	}

	function updateTotal(delta){
		const el = document.getElementById('total')
		if(!el) return
		const cur = parseFloat(el.textContent || '0')
		el.textContent = (cur + parseFloat(delta)).toFixed(2)
	}

	async function submitForm(ev){
		ev.preventDefault()
		const form = ev.target
		const data = Object.fromEntries(new FormData(form).entries())
		if(!data.amount) return
		const payload = {date: data.date, category: data.category, amount: data.amount, note: data.note}
		try{
			const res = await fetch(api, {method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(payload)})
			if(!res.ok){
				const err = await res.json().catch(()=>({}));
				alert(err.error || 'Failed to add expense')
				return
			}
			const saved = await res.json()
			addRowToTable(saved)
			updateTotal(saved.amount)
			form.reset()
		}catch(e){
			console.error(e)
			alert('Network error')
		}
	}

	document.addEventListener('DOMContentLoaded', async ()=>{
		const form = document.getElementById('expenseForm')
		if(form) form.addEventListener('submit', submitForm)
		// optionally refresh table from API (keeps server and client in sync)
		const data = await fetchExpenses()
		if(Array.isArray(data) && data.length){
			// we assume server-render already present; skip re-render to avoid duplicates
			console.debug('expenses loaded', data.length)
		}
	})
})();
