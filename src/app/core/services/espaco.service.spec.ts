import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { EspacosService } from './espaco.service';

describe('EspacosService', () => {
  let service: EspacosService;
  let http: HttpTestingController;
  const url = 'https://foodfest-111a6-default-rtdb.firebaseio.com/espacos';
  const dados = { nome: 'Sala A', localizacao: 'Andar 1', capacidade: 6, recursos: 'Wi-Fi', precoHora: 50, tipoEspaco: 'Sala', disponivel: false };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(EspacosService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('reads an empty collection', () => {
    service.getAll().subscribe(data => expect(data).toEqual([]));
    http.expectOne(`${url}.json`).flush(null);
  });
  it('reads numeric identifiers and preserves availability', () => {
    service.getAll().subscribe(data => expect(data).toEqual([{ ...dados, id: 123 }]));
    http.expectOne(`${url}.json`).flush({ '123': dados });
  });
  it('creates a space with all fields and a safe numeric identifier', () => {
    service.create(dados).subscribe(data => {
      expect(Number.isSafeInteger(data.id)).toBe(true);
      expect(data.disponivel).toBe(false);
    });
    const request = http.expectOne(req => req.method === 'PUT' && req.url.startsWith(`${url}/`));
    expect(request.request.body).toEqual(dados);
    request.flush(dados);
  });
  it('reports a missing space', () => {
    let failed = false;
    service.getById(123).subscribe({ error: () => { failed = true; } });
    http.expectOne(`${url}/123.json`).flush(null);
    expect(failed).toBe(true);
  });
  it('updates an existing space without changing its identifier', () => {
    service.update(123, dados).subscribe(data => expect(data.id).toBe(123));
    const request = http.expectOne(`${url}/123.json`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(dados);
    request.flush(dados);
  });
  it('deletes only the selected space', () => {
    service.delete(123).subscribe();
    const request = http.expectOne(`${url}/123.json`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });
});
