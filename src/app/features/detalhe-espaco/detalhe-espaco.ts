import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { EspacosService } from '../../core/services/espaco.service';
@Component({ selector: 'app-detalhe-espaco', imports: [AsyncPipe, CurrencyPipe, RouterLink], templateUrl: './detalhe-espaco.html', styleUrl: './detalhe-espaco.css' })
export class DetalheEspaco {
  private service = inject(EspacosService);
  readonly estado$ = inject(ActivatedRoute).paramMap.pipe(switchMap(params => {
    const id = Number(params.get('id'));
    if (!Number.isSafeInteger(id) || id <= 0) return of({ loading: false, espaco: null });
    return this.service.getById(id).pipe(
      map(espaco => ({ loading: false, espaco })),
      catchError(() => of({ loading: false, espaco: null })),
      startWith({ loading: true, espaco: null }),
    );
  }));
}
