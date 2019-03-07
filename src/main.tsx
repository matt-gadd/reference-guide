import renderer from '@dojo/framework/widget-core/vdom';
import { tsx } from '@dojo/framework/widget-core/tsx';
import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import Outlet from '@dojo/framework/routing/Outlet';
import Registry from '@dojo/framework/widget-core/Registry';
import { registerRouterInjector } from '@dojo/framework/routing/RouterInjector';
import StateHistory from '@dojo/framework/routing/history/StateHistory';
import Link from '@dojo/framework/routing/Link';

import ReferenceGuide from './ReferenceGuide';
import ReferenceGuideContent from './ReferenceGuideContent';

import routes from './routes';

const registry = new Registry();

registerRouterInjector(routes, registry, { HistoryManager: StateHistory });

const hash = () => {
	const id = window.location.hash.replace('#', '');
	if (id) {
		const observer = new MutationObserver(() => {
			const element = document.getElementById(id)
			if (element) {
				observer.disconnect();
				element && element.scrollIntoView(true);
			}
		});
		observer.observe(document.documentElement, {
			childList: true,
			subtree: true
		});
	}
}

const pushState = history.pushState;
history.pushState = (...args: any[]) => {
    pushState.apply(history, args);
	hash();
};

hash();

class App extends WidgetBase {
	render() {
		const url = "https://raw.githubusercontent.com/dojo/framework/master/docs/en/i18n/index.md";
		return (
			<div>
				<Outlet id="i18n" renderer={ () => {
					return (
						<ReferenceGuide url={ url } renderer={ ({ toc }) => {
							const table = toc.map(({ value, href, children }: any) => {
								href = href.replace(/^\.\//, '').replace(/#.*/, '').replace('.md', '');
								return (
									<ul>
										<li>
										<Link to="i18n-content" params={ { href } }>{ value }</Link>
										<ul>{ children.map(({ value , href }: { value: string, href: string }) => {
											href = href.replace(/^\.\//, '').replace('.md', '');
											return (
												<li>
													<Link to="i18n-content" params={ { href } }>{ value }</Link>
												</li>
											)
										}) }</ul>
										</li>
									</ul>
								)
							});
							return (
								<div>
									{ table }
									<Outlet id="i18n-content" renderer={ ({ params }) => {
										const { href } = params;
										return <ReferenceGuideContent url={ href } renderer={ ({ content }) => content } />
									} } />
								</div>
							);
						}} />
					);
				} } />
			</div>
		);
	}
}

const r = renderer(() => <App />);
r.mount({ registry, domNode: document.getElementById('root') as HTMLElement });
