import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import Block from '@dojo/framework/widget-core/meta/Block';
import ReferenceGuideContentBlock from './ReferenceGuideContent.block';
import { DNode } from '@dojo/framework/widget-core/interfaces';

interface ReferenceGuideContentProperties {
	url: string;
	renderer(toc: any): DNode | DNode[];
}

export default class ReferenceGuideContent extends WidgetBase<ReferenceGuideContentProperties> {
	render() {
		const { url, renderer } = this.properties;
		const content = this.meta(Block).run(ReferenceGuideContentBlock)({ url }) || '';
		return renderer({ content });
	}
}
