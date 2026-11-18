import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { ManutencaoEspaco } from './manutencao-espaco';
import { EspacosService } from '../../core/services/espaco.service';

describe('Cadastro e edição de espaços', () => {
  const dados = { nome: 'Sala A', localizacao: 'Centro', capacidade: 6, recursos: 'Wi-Fi', precoHora: 25.5, tipoEspaco: 'Sala', disponivel: false };
  let service: { create: ReturnType<typeof vi.fn>; update: ReturnType<typeof vi.fn>; getById: ReturnType<typeof vi.fn> };
  let id: string | null;

  beforeEach(() => {
    id = null;
    service = {
      create: vi.fn().mockReturnValue(of({ ...dados, id: 123 })),
      update: vi.fn().mockReturnValue(of({ ...dados, id: 123 })),
      getById: vi.fn().mockReturnValue(of({ ...dados, id: 123 })),
    };
    TestBed.configureTestingModule({
      imports: [ManutencaoEspaco],
      providers: [provideRouter([]),
        { provide: EspacosService, useValue: service },
        { provide: ActivatedRoute, useValue: { snapshot: { get paramMap() { return convertToParamMap(id === null ? {} : { id }); } } } },
      ],
    });
  });
  afterEach(() => { vi.useRealTimers(); });

  function montar() {
    const fixture = TestBed.createComponent(ManutencaoEspaco);
    fixture.detectChanges();
    return fixture;
  }

  it('mostra os erros e impede enviar um cadastro vazio', () => {
    const fixture = montar();
    fixture.componentInstance.submit();
    fixture.detectChanges();
    expect(service.create).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Informe o nome do espaço');
  });

  it('rejeita capacidade fracionária, preço inválido e nome longo', () => {
    const component = montar().componentInstance;
    component.form.setValue({ ...dados, capacidade: 1.5, precoHora: 1.234, nome: 'a'.repeat(101) });
    component.submit();
    expect(component.form.controls.capacidade.invalid).toBe(true);
    expect(component.form.controls.precoHora.invalid).toBe(true);
    expect(component.form.controls.nome.invalid).toBe(true);
    expect(service.create).not.toHaveBeenCalled();
  });

  it('cria com todos os campos e preserva a indisponibilidade', () => {
    vi.useFakeTimers();
    const component = montar().componentInstance;
    component.form.setValue({ ...dados, nome: ' Sala A ' });
    component.submit();
    expect(service.create).toHaveBeenCalledWith(dados);
    expect(component.successMessage).toContain('criado');
    vi.clearAllTimers();
  });

  it('carrega e salva uma edição com o mesmo identificador', () => {
    vi.useFakeTimers();
    id = '123';
    const component = montar().componentInstance;
    expect(component.form.getRawValue()).toEqual(dados);
    component.form.controls.capacidade.setValue(8);
    component.submit();
    expect(service.update).toHaveBeenCalledWith(123, { ...dados, capacidade: 8 });
    expect(service.create).not.toHaveBeenCalled();
    vi.clearAllTimers();
  });

  it('preserva os dados e permite tentar novamente após falha', () => {
    service.create.mockReturnValue(throwError(() => new Error('Sem conexão')));
    const component = montar().componentInstance;
    component.form.setValue(dados);
    component.submit();
    expect(component.form.getRawValue()).toEqual(dados);
    expect(component.loading).toBe(false);
    expect(component.errorMessage).toContain('Não foi possível salvar');
    component.submit();
    expect(service.create).toHaveBeenCalledTimes(2);
  });

  it('impede salvar quando o espaço para edição não existe', () => {
    id = '123';
    service.getById.mockReturnValue(throwError(() => new Error('Não encontrado')));
    const component = montar().componentInstance;
    component.form.setValue(dados);
    component.submit();
    expect(component.loadFailed).toBe(true);
    expect(service.update).not.toHaveBeenCalled();
  });
});
