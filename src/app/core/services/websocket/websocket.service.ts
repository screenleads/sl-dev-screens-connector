import { Injectable } from "@angular/core";
import { ReplaySubject, BehaviorSubject, Subject, skip, filter, tap, map, retry, timer, Observable, distinctUntilChanged, take } from "rxjs";
import { webSocket } from 'rxjs/webSocket';

export const WS_ENDPOINT = 'localhost:8080/ws';
export const RECONNECT_INTERVAL = 5000;

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private observablesTopics: Record<string, ReplaySubject<any>> = {};
  private status$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private ws: any;
  public messages$: Subject<unknown> = new Subject<unknown>();

  constructor(
  ) {
  }

  public connect(): void {
    this.create();
    this.connectionStatus$.pipe(
      skip(1),
      filter(status => !status),
      tap(() => this.create()),
    ).subscribe();
  }

  private create() {
    if (this.ws) {
      this.ws.unsubscribe();
    }
    // let queryParams = `?token=${this.tokenService.getToken()}`;

    const openObserver = new Subject<Event>();
    openObserver.pipe(map((_) => true)).subscribe(this.status$);
    const closeObserver = new Subject<CloseEvent>();
    closeObserver.pipe(map((_) => false)).subscribe(this.status$);
    this.ws = webSocket<any>({
      url: WS_ENDPOINT,
      openObserver,
      closeObserver,
    });
    this.ws.pipe(retry({
      delay: (errs) => {
        this.status$.next(false);
        console.log(`Websocket connection down, will attempt reconnection in ${RECONNECT_INTERVAL}ms`);
        return timer(RECONNECT_INTERVAL);
      }
    })).subscribe(this.messages$);
  }

  public get connectionStatus$(): Observable<boolean> {
    return this.status$.pipe(distinctUntilChanged());
  }

  close() {
    if (this.ws) {
      this.ws.unsubscribe();
    }
  }

  message(message: any) {
    this.connectionStatus$.pipe(
      filter(status => status),
      tap(() => this.ws.next(message)),
      take(1)
    ).subscribe();
  }
}