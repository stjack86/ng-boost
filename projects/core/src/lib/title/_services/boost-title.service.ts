import { Injectable, Injector } from '@angular/core';
import { Destroy$ } from '../../utils/destroy';
import { from, Observable, Subject } from 'rxjs';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { RouterUtilsService } from '../../utils/router-utils.service';
import { concatMap, defaultIfEmpty, filter, switchMap, takeUntil, takeWhile } from 'rxjs/operators';
import { reemitWhen, wrapIntoObservable } from '../../utils/rxjs';
import { Title } from '@angular/platform-browser';
import { TitleRouteResolver } from './title.route.resolver';
import { TitleMainResolver } from './title.main.resolver';
import { EMPTY_TITLE, ROUTE_DATA_FIELD_NAME } from '../_models/fields';

@Injectable()
export class BoostTitleService {
  static readonly EMPTY_TITLE = EMPTY_TITLE;
  static readonly ROUTE_DATA_FIELD_NAME = ROUTE_DATA_FIELD_NAME;

  @Destroy$() private readonly destroy$ = new Subject();
  private readonly refresh$ = new Subject();

  private readonly initialTitle: string;

  constructor(
    private router: Router,
    private injector: Injector,
    private routerUtils: RouterUtilsService,
    private defaultResolver: TitleRouteResolver,
    private titleService: Title,
    private titleMainResolver: TitleMainResolver,
  ) {
    this.initialTitle = this.titleService.getTitle();

    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter(it => it instanceof NavigationEnd),
        reemitWhen(this.refresh$),
        switchMap(() => this._resolveTitle()),
        switchMap(title => wrapIntoObservable(this.titleMainResolver.resolve(title, this.initialTitle))),
      )
      .subscribe(title => {
        this.titleService.setTitle(title);
      });
  }

  refresh() {
    this.refresh$.next();
  }

  private _resolveTitle(): Observable<string> {
    const routesChain = this.routerUtils.getCurrentRoutesChain()
      /* So that while iterating we would get leaf first */
      .reverse();

    let wasResolved = false;

    return from(routesChain)
      .pipe(
        takeWhile(() => !wasResolved),
        concatMap(it => this.resolveTitle(it.snapshot)),
        filter(value => {
          if (value) {
            wasResolved = true;
            return true;
          }

          return false;
        }),
        defaultIfEmpty(BoostTitleService.EMPTY_TITLE),
      );

  }

  private resolveTitle(route: ActivatedRouteSnapshot): Observable<string> {
    return this.routerUtils.resolveRouteData({
      emptyValue: BoostTitleService.EMPTY_TITLE,
      fieldName: BoostTitleService.ROUTE_DATA_FIELD_NAME,
      resolverBaseClass: TitleRouteResolver,
      route,
      defaultResolver: this.defaultResolver,
    });
  }
}
