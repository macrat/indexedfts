import {Suite} from 'asyncmark';

import IndexedFTS from '../lib';


export default function(base) {
	return new Suite(Object.assign(base, {
		async before() {
			this.db = await (new IndexedFTS('test-numeric', 1, {value: {}})).open();
		},
		async after() {
			this.db.close();
			await IndexedFTS.delete('test-text');
		},
	}))
	.add({
		name: 'IndexedFTS#put',
		number: 10000,
		fun() {
			return this.db.put({value: Math.round(Math.random()*100)});
		},
	})
	.add({
		name: 'IndexedFTS#between 10 - 20',
		async fun() {
			await this.db.between('value', 10, 20);
		},
	})
	.add({
		name: 'IFTSTransaction#between 10 - 20',
		async fun() {
			await this.db.transaction().between('value', 10, 20);
		},
	})
	.add({
		name: 'IFTSArrayPromise#between 10 - 20',
		async fun() {
			await this.db.transaction().between('value', 10, 20);
		},
	})
	.add({
		name: 'IndexedFTS#equals 15',
		async fun() {
			await this.db.equals('value', 15);
		},
	})
	.add({
		name: 'IFTSTransaction#equals 15',
		async fun() {
			await this.db.transaction().equals('value', 15);
		},
	})
	.add({
		name: 'IFTSArrayPromise#equals 15',
		async fun() {
			await this.db.transaction().equals('value', 15);
		},
	})
	.add({
		name: 'IndexedFTS#lower 10',
		async fun() {
			await this.db.lower('value', 10);
		},
	})
	.add({
		name: 'IFTSTransaction#lower 10',
		async fun() {
			await this.db.transaction().lower('value', 10);
		},
	})
	.add({
		name: 'IFTSArrayPromise#lower 10',
		async fun() {
			await this.db.transaction().lower('value', 10);
		},
	})
	.add({
		name: 'IndexedFTS#sort',
		async fun() {
			await this.db.sort('value');
		},
	})
	.add({
		name: 'IFTSTransaction#sort',
		async fun() {
			await this.db.sort('value');
		},
	})
	.add({
		name: 'IFTSArrayPromise#sort',
		async fun() {
			await this.db.sort('value');
		},
	})
}
