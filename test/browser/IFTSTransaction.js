import assert from 'power-assert';

import IndexedFTS from '../../lib';

import apitest from '../common/apitest';


describe('IFTSTransaction', function() {
	apitest(async function() {
		this.db = new IndexedFTS('test', 1, this.schema);

		await this.db.open();
		await this.db.put(...this.values);
	});

	before(function() {
		Object.defineProperty(this, 'target', {
			get() { return this.db.transaction(); }
		});
	});

	it('getAll', async function() {
		assert.deepStrictEqual(
			await this.target.getAll(),
			this.values,
		);
	});

	describe('get', function() {
		it('single', async function() {
			assert.deepStrictEqual(
				await this.target.get(1),
				this.values[1],
			);
		});
		it('not found', async function() {
			assert(await this.target.get(3) === undefined);
			assert(await this.target.get('hello') === undefined);
		});
		it('invalid key', async function() {
			assert(await this.target.get(null).catch(err => err) === 'invalid key');
			assert(await this.target.get(undefined).catch(err => err) === 'invalid key');
		});
		it('all', async function() {
			assert.deepStrictEqual(
				await this.target.getAll(),
				this.values,
			);
		});
	});
});