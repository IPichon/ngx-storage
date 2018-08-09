import { Dummy, Inner } from './dummy.model';


const inner1: Inner = new Inner( {
    regexp: new RegExp('inner1', 'i'),
    stuff: ['some', 'stuff']
  });

const inner2: Inner = new Inner( {
    regexp: new RegExp('inner2', 'i'),
    stuff: ['some', 'other', 'stuff']
  });

const inner3: Inner = new Inner( {
    regexp: new RegExp('inner2', 'i'),
    stuff: ['yet', 'again', 'some', 'other', 'stuff']
  });

export const DummySample: Dummy = new Dummy({
    name: 'dummy',
    birthDate: new Date(),
    inners: [inner1, inner2],
    in: inner3
});
