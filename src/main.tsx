import renderer from '@dojo/framework/widget-core/vdom';
import { tsx } from '@dojo/framework/widget-core/tsx';
import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import Outlet from '@dojo/framework/routing/Outlet';
import Registry from '@dojo/framework/widget-core/Registry';
import { registerRouterInjector } from '@dojo/framework/routing/RouterInjector';
import StateHistory from '@dojo/framework/routing/history/StateHistory';
import hash from './routerHack';

import routes from './routes';
import ReferenceGuide from './ReferenceGuide';

const registry = new Registry();
registerRouterInjector(routes, registry, { HistoryManager: StateHistory });


class App extends WidgetBase {
	render() {
		const i18n = "https://raw.githubusercontent.com/dojo/framework/master/docs/en/i18n/index.md";
		return (
			<div>
				<Outlet id="i18n" renderer={ () => <ReferenceGuide name='i18n' url={ i18n } /> } />
			</div>
		);
	}
}

const r = renderer(() => <App />);
r.mount({ registry, domNode: document.getElementById('root') as HTMLElement });
hash();
