import assert from 'power-assert';


function apitest(targetFunc) {
	beforeEach(async function() {
		this.schema = apitest.schema;
		this.values = apitest.values;
		await targetFunc.call(this);
	});

	it('map', async function() {
		assert.deepStrictEqual(
			await this.target.map(x => x.title),
			this.values.map(x => x.title),
		);

		assert.deepStrictEqual(
			await this.target.map(x => x.id * 2),
			this.values.map(x => x.id * 2),
		);
	});

	describe('filter', function() {
		it('simple', async function() {
			assert.deepStrictEqual(
				await this.target.filter(x => x.id >= 1),
				this.values.filter(x => x.id >= 1),
			);

			assert.deepStrictEqual(
				await this.target.filter(x => x.title === 'test data'),
				this.values.filter(x => x.title === 'test data'),
			);
		});

		it('all', async function() {
			assert.deepStrictEqual(
				await this.target.filter(x => true),
				this.values,
			);
		});

		it('nothing', async function() {
			assert.deepStrictEqual(
				await this.target.filter(x => false),
				[],
			);
		});
	});

	describe('sort', function() {
		it('asc by id', async function() {
			assert.deepStrictEqual(
				await this.target.sort('id').map(x => x.id),
				[0, 1, 2, 3],
			);
			assert.deepStrictEqual(
				await this.target.sort('id', 'asc').map(x => x.id),
				[0, 1, 2, 3],
			);
		});
		it('desc by id', async function() {
			assert.deepStrictEqual(
				await this.target.sort('id', 'desc').map(x => x.id),
				[3, 2, 1, 0],
			);
		});
		it('asc by title', async function() {
			assert.deepStrictEqual(
				await this.target.sort('title').map(x => x.title),
				['Hello World', 'hello world', 'japanese data 日本語', 'test content'],
			);
			assert.deepStrictEqual(
				await this.target.sort('title', 'asc').map(x => x.title),
				['Hello World', 'hello world', 'japanese data 日本語', 'test content'],
			);
		});
		it('desc by title', async function() {
			assert.deepStrictEqual(
				await this.target.sort('title', 'desc').map(x => x.title),
				['test content', 'japanese data 日本語', 'hello world', 'Hello World'],
			);
		});
		it('missing column', async function() {
			const err = await this.target.sort('foobar')
				.then(x => 'not causes error')
				.catch(err => err);

			assert(err.toString() === 'foobar: no such column or no indexed');
			assert(err.column === 'foobar');
		});
		it('offset', async function() {
			assert.deepStrictEqual(
				await this.target.sort('id', 'asc', 1).map(x => x.id),
				[1, 2, 3],
			);
			assert.deepStrictEqual(
				await this.target.sort('id', 'desc', 2).map(x => x.id),
				[1, 0],
			);
			assert.deepStrictEqual(
				await this.target.sort('id', 'asc', 100).map(x => x.id),
				[],
			);
		});
		it('limit', async function() {
			assert.deepStrictEqual(
				await this.target.sort('id', 'asc', 0, 2).map(x => x.id),
				[0, 1],
			);
			assert.deepStrictEqual(
				await this.target.sort('id', 'desc', 0, 1).map(x => x.id),
				[3],
			);
			assert.deepStrictEqual(
				await this.target.sort('id', 'asc', 0, 100).map(x => x.id),
				[0, 1, 2, 3],
			);
		});
		it('offset / limit', async function() {
			assert.deepStrictEqual(
				await this.target.sort('id', 'asc', 1, 1).map(x => x.id),
				[1],
			);
			assert.deepStrictEqual(
				await this.target.sort('id', 'asc', 1, 2).map(x => x.id),
				[1, 2],
			);
			assert.deepStrictEqual(
				await this.target.sort('id', 'asc', 1, 100).map(x => x.id),
				[1, 2, 3],
			);
			assert.deepStrictEqual(
				await this.target.sort('id', 'asc', 100, 5).map(x => x.id),
				[],
			);
		});
	});

	describe('equals', function() {
		it('simple', async function() {
			try {
				assert.deepStrictEqual(
					await this.target.equals('title', 'test content'),
					[this.values[1]],
				);
			} catch(e) {
				console.error(e);
			}
		});

		it('invalid column', async function() {
			const err = await this.target.equals('foobar', 'hello')
				.then(x => 'not causes error')
				.catch(err => err);

			assert(err.toString() === 'foobar: no such column or no indexed');
			assert(err.column === 'foobar');
		});
	});

	describe('lower', function() {
		it('simple', async function() {
			assert.deepStrictEqual(
				await this.target.lower('age', 15),
				[this.values[0]],
			);
		});

		it('invalid column', async function() {
			const err = await this.target.lower('foobar', 'hello')
				.then(x => 'not causes error')
				.catch(err => err);

			assert(err.toString() === 'foobar: no such column or no indexed');
			assert(err.column === 'foobar');
		});
	});

	describe('lowerOrEquals', function() {
		it('simple', async function() {
			assert.deepStrictEqual(
				await this.target.lowerOrEquals('age', 15),
				this.values.slice(0, 2),
			);
		});

		it('invalid column', async function() {
			const err = await this.target.lowerOrEquals('foobar', 'hello')
				.then(x => 'not causes error')
				.catch(err => err);

			assert(err.toString() === 'foobar: no such column or no indexed');
			assert(err.column === 'foobar');
		});
	});

	describe('greater', function() {
		it('simple', async function() {
			assert.deepStrictEqual(
				await this.target.greater('age', 15),
				this.values.slice(2),
			);
		});

		it('invalid column', async function() {
			const err = await this.target.greater('foobar', 'hello')
				.then(x => 'not causes error')
				.catch(err => err);

			assert(err.toString() === 'foobar: no such column or no indexed');
			assert(err.column === 'foobar');
		});
	});

	describe('greaterOrEquals', function() {
		it('simple', async function() {
			assert.deepStrictEqual(
				await this.target.greaterOrEquals('age', 15),
				this.values.slice(1),
			);
		});

		it('invalid column', async function() {
			const err = await this.target.greaterOrEquals('foobar', 'hello')
				.then(x => 'not causes error')
				.catch(err => err);

			assert(err.toString() === 'foobar: no such column or no indexed');
			assert(err.column === 'foobar');
		});
	});

	describe('between', function() {
		it('simple', async function() {
			assert.deepStrictEqual(
				await this.target.between('age', 12, 17),
				this.values.filter(x => 12 <= x.age && x.age <= 17),
			);
			assert.deepStrictEqual(
				await this.target.between('age', 9, 15),
				this.values.filter(x => 9 <= x.age && x.age <= 15),
			);
			assert.deepStrictEqual(
				await this.target.between('age', 15, 21),
				this.values.filter(x => 15 <= x.age && x.age <= 21),
			);
		});

		it('invalid column', async function() {
			const err = await this.target.between('foobar', 0, 10)
				.then(x => 'not causes error')
				.catch(err => err);

			assert(err.toString() === 'foobar: no such column or no indexed');
			assert(err.column === 'foobar');
		});
	});

	describe('search', function() {
		describe('case sensitive', function() {
			it('simple', async function() {
				assert.deepStrictEqual(
					await this.target.search('title', 'Hello'),
					[this.values[3]],
				);
				assert.deepStrictEqual(
					await this.target.search('title', 'Hello', {ignoreCase: false}),
					[this.values[3]],
				);
			});
			it('single character', async function() {
				assert.deepStrictEqual(
					await this.target.search('title', 'H'),
					[this.values[3]],
				);
				assert.deepStrictEqual(
					await this.target.search('title', 'j'),
					[this.values[2]],
				);
				assert.deepStrictEqual(
					await this.target.search(['title', 'text'], 'i data'),
					[this.values[1]],
				);
			});
			it('japanese', async function() {
				assert.deepStrictEqual(
					await this.target.search('title', '日本語'),
					[this.values[2]],
				);
			});
		});

		describe('ignore case', function() {
			it('simple', async function() {
				assert.deepStrictEqual(
					await this.target.search('title', 'hello', {ignoreCase: true}),
					[this.values[0], this.values[3]],
				);
			});
			it('single character', async function() {
				assert.deepStrictEqual(
					await this.target.search('title', 'H', {ignoreCase: true}),
					[this.values[0], this.values[3]],
				);
			});
			it('japanese', async function() {
				assert.deepStrictEqual(
					await this.target.search('title', '日本語', {ignoreCase: true}),
					[this.values[2]],
				);
			});
		});

		it('multi columns', async function() {
			assert.deepStrictEqual(
				await this.target.search(['title', 'text'], 'data'),
				[this.values[1], this.values[2]],
			);
		});
		it('not found', async function() {
			assert.deepStrictEqual(
				await this.target.search(['title', 'text'], 'this is not included'),
				[],
			);
		});
		it('invalid column', async function() {
			const err = await this.target.search('foobar', 'hello')
				.then(x => 'not causes error')
				.catch(err => err);

			assert(err.toString() === 'foobar: no such column or no indexed');
			assert(err.column === 'foobar');
		});

		describe('joint query', async function() {
			it('success', async function() {
				assert.deepStrictEqual(
					await this.target.search(['title', 'text'], 'data').lower('id', 2),
					[this.values[1]],
				);

				assert.deepStrictEqual(
					await this.target.lower('id', 2).search(['title', 'text'], 'data'),
					await this.target.search(['title', 'text'], 'data').lower('id', 2),
				);
			});

			it('error', async function() {
				const err = await this.target
					.equals('id', 0)
					.search('foobar', 'hello')
					.equals('title', 'hello world')
					.then(x => 'not causes error')
					.catch(err => err);

				assert(err.toString() === 'foobar: no such column or no indexed');
				assert(err.column === 'foobar');
			});
		});
	});

	describe('searchWord', function() {
		describe('case sensitive', function() {
			it('simple', async function() {
				assert.deepStrictEqual(
					await this.target.searchWord('text', 'test').sort('id'),
					[this.values[0], this.values[1]],
				);

				assert.deepStrictEqual(
					await this.target.searchWord('text', 'test', {ignoreCase: false}).sort('id'),
					[this.values[0], this.values[1]],
				);
			});
			it('partial', async function() {
				assert.deepStrictEqual(
					await this.target.searchWord('text', 'est'),
					[],
				);
				assert.deepStrictEqual(
					await this.target.searchWord('text', 'He'),
					[],
				);

				assert.deepStrictEqual(
					await this.target.searchWord('text', 'est', {ignoreCase: false}),
					[],
				);
				assert.deepStrictEqual(
					await this.target.searchWord('text', 'He', {ignoreCase: false}),
					[],
				);
			});
			it('japanese', async function() {
				assert.deepStrictEqual(
					await this.target.searchWord('title', '日本語'),
					[this.values[2]],
				);
				assert.deepStrictEqual(
					await this.target.searchWord('title', '日本語', {ignoreCase: false}),
					[this.values[2]],
				);
			});
		});

		describe('ignore case', function() {
			it('simple', async function() {
				assert.deepStrictEqual(
					await this.target.searchWord('text', 'test', {ignoreCase: true}).sort('id'),
					[this.values[0], this.values[1], this.values[3]],
				);
			});
			it('partial', async function() {
				assert.deepStrictEqual(
					await this.target.searchWord('text', 'est', {ignoreCase: true}),
					[],
				);
				assert.deepStrictEqual(
					await this.target.searchWord('text', 'He', {ignoreCase: true}),
					[],
				);
			});
			it('japanese', async function() {
				assert.deepStrictEqual(
					await this.target.searchWord('title', '日本語', {ignoreCase: true}),
					[this.values[2]],
				);
			});
		});

		it('multi columns', async function() {
			assert.deepStrictEqual(
				await this.target.searchWord(['title', 'text'], 'data').sort('id'),
				[this.values[1], this.values[2]],
			);
		});
		it('not found', async function() {
			assert.deepStrictEqual(
				await this.target.searchWord(['title', 'text'], 'this is not included'),
				[],
			);
		});
		it('invalid column', async function() {
			const err = await this.target.searchWord('foobar', 'hello')
				.then(x => 'not causes error')
				.catch(err => err);

			assert(err.toString() === 'foobar: no such column or no indexed');
			assert(err.column === 'foobar');
		});
	});
}


apitest.schema = {
	id: 'primary',
	title: {unique: true, fulltext: true, word: true},
	text: {ngram: true, word: true},
	age: {},
};


apitest.values = [{
	id: 0,
	title: 'hello world',
	text: 'hello world!\nthis is test',
	age: 10,
}, {
	id: 1,
	title: 'test content',
	text: 'this is test data\nhello hello\n',
	age: 15,
}, {
	id: 2,
	title: 'japanese data 日本語',
	text: 'あいうえお\nhello こんにちは\n',
	age: 20,
}, {
	id: 3,
	title: 'Hello World',
	text: 'Hello World!\nThis Is Test',
	age: 25,
}];


export default apitest;
