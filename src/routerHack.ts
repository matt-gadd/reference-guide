
const hash = () => {
	const id = window.location.hash.replace('#', '');
	if (id) {
		const element = document.getElementById(id)
		if (element) {
			element.scrollIntoView(true);
		}
		else {
			const observer = new MutationObserver(() => {
				const element = document.getElementById(id)
				if (element) {
					observer.disconnect();
					element.scrollIntoView(true);
				}
			});
			observer.observe(document.documentElement, {
				childList: true,
				subtree: true
			});
		}
	}
}

const pushState = history.pushState;
history.pushState = (...args: any[]) => {
    pushState.apply(history, args);
	hash();
};

export default hash;

