import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Manuntencaoconteudo } from './manuntencaoconteudo';

describe('Manuntencaoconteudo', () => {
  let component: Manuntencaoconteudo;
  let fixture: ComponentFixture<Manuntencaoconteudo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Manuntencaoconteudo],
    }).compileComponents();

    fixture = TestBed.createComponent(Manuntencaoconteudo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
