import assert from 'power-assert';

import IndexedFTS from '../../lib';

import apitest from '../common/apitest';
import readwritetest from '../common/readwritetest';


describe('IndexedFTS', function() {
	apitest(async function() {
		this.target = new IndexedFTS('test', 1, this.schema);

		await this.target.open();
		await this.target.put(...this.values);
	});

	readwritetest();
});
