import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Detalheconteudo } from './detalheconteudo';

describe('Detalheconteudo', () => {
  let component: Detalheconteudo;
  let fixture: ComponentFixture<Detalheconteudo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Detalheconteudo],
    }).compileComponents();

    fixture = TestBed.createComponent(Detalheconteudo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
