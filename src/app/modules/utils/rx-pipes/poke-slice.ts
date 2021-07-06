import {Observable, OperatorFunction} from "rxjs";
import {map} from "rxjs/operators";

export function pokeSlice<T>(pageIndex: number, pageSize: number): OperatorFunction<T[], T[]> {
  const offset = getPagePokeOffset(pageIndex, pageSize);
  const limit = offset + 1 + pageSize;

  return function operateFunction<T>(source: Observable<T[]>): Observable<T[]> {
    return source.pipe(
      map(result => result.slice(offset + 1, limit))
    )
  }
}

function getPagePokeOffset(pageIndex: number, pageSize: number): number {
  if (pageIndex === 1) {
    return -1;
  }
  return (pageSize * (pageIndex - 1)) - 1;
}
