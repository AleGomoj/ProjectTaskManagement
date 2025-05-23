import { arrayMove } from './arrayMove';

describe('arrayMove', () => {
  it('moves an item forward in the array', () => {
    const arr = [1, 2, 3, 4];
    const result = arrayMove(arr, 1, 3);
    expect(result).toEqual([1, 3, 4, 2]);
  });

  it('moves an item backward in the array', () => {
    const arr = [1, 2, 3, 4];
    const result = arrayMove(arr, 3, 1);
    expect(result).toEqual([1, 4, 2, 3]);
  });

  it('returns a new array and does not mutate the original', () => {
    const arr = [1, 2, 3, 4];
    const result = arrayMove(arr, 0, 2);
    expect(result).toEqual([2, 3, 1, 4]);
    expect(arr).toEqual([1, 2, 3, 4]);
  });

  it('handles moving to the same index', () => {
    const arr = [1, 2, 3, 4];
    const result = arrayMove(arr, 2, 2);
    expect(result).toEqual([1, 2, 3, 4]);
  });
});
