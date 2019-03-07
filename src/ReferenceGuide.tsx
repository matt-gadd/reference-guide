import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import Block from '@dojo/framework/widget-core/meta/Block';
import { DNode } from '@dojo/framework/widget-core/interfaces';
import ReferenceGuideBlock from './ReferenceGuide.block';

interface ReferenceGuideProperties {
	url: string;
	renderer(toc: any): DNode | DNode[];
}

export default class ReferenceGuide extends WidgetBase<ReferenceGuideProperties> {
	render() {
		const { url, renderer } = this.properties;
		const toc = this.meta(Block).run(ReferenceGuideBlock)({ url }) || [];
		return renderer({ toc });
	}
}

