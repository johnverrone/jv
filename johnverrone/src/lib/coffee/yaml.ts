import { stringify } from 'yaml';
import type { CoffeeBean } from './types';

export function serializeBeanToYaml(bean: CoffeeBean): string {
	return stringify(bean, {
		lineWidth: 0,
		nullStr: 'null',
		defaultStringType: 'PLAIN',
		defaultKeyType: 'PLAIN'
	});
}
