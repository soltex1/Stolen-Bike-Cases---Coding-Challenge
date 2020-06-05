interface ServiceInit<T> {
  status: "init";
  payload?: T;
}
interface ServiceLoading<T> {
  status: "loading";
  payload?: T;
}

interface ServiceLoaded<T> {
  status: "loaded";
  payload: T;
}
interface ServiceError<T> {
  status: "error";
  error: Error;
  payload?: T;
}
export type Service<T> =
  | ServiceInit<T>
  | ServiceLoading<T>
  | ServiceLoaded<T>
  | ServiceError<T>;
