import {Observable} from 'rxjs';

export function createHttpObservable(url: string) {
  return Observable.create(observer => {

    const controller = new AbortController();
    const signal = controller.signal;

    fetch(url, {signal})
      .then(response => {
        console.log('Fetch data');
        if (response.ok) {
          console.log('Fetch data successful');
          return response.json();
        } else {
          console.log('Fetch data failed');
          observer.error(`Request failed with status code: ${response.status}`);
        }
      })
      .then(body => {

        observer.next(body);

        observer.complete();

      })
      .catch(err => {
        observer.error(err);
      });

    // this will trigger when we unsubscribe this observable of HTTP request
    return () => controller.abort();
  });
}
