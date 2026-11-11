import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Espaco } from '../models/espaco.model';

type DadosEspaco = Omit<Espaco, 'id'>;
@Injectable({ providedIn: 'root' })
export class EspacosService {
  private http = inject(HttpClient);
  private apiUrl = 'https://foodfest-111a6-default-rtdb.firebaseio.com/espacos';

  getAll(): Observable<Espaco[]> {
    return this.http.get<Record<string, DadosEspaco> | null>(`${this.apiUrl}.json`).pipe(
      map(response => Object.entries(response ?? {}).map(([id, dados]) => ({ ...dados, id: Number(id) })))
    );
  }
  getById(id: number): Observable<Espaco> {
    return this.http.get<DadosEspaco | null>(`${this.apiUrl}/${id}.json`).pipe(map(dados => {
      if (!dados) throw new Error('Espaço não encontrado.');
      return { ...dados, id };
    }));
  }
  create(dados: DadosEspaco): Observable<Espaco> {
    const id = Date.now() * 1000 + Math.floor(Math.random() * 1000);
    return this.update(id, dados);
  }
  update(id: number, dados: DadosEspaco): Observable<Espaco> {
    return this.http.put<DadosEspaco>(`${this.apiUrl}/${id}.json`, dados).pipe(map(response => ({ ...response, id })));
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}.json`);
  }
}
