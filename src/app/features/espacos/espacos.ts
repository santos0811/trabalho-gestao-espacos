import { finalize } from 'rxjs';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EspacosService } from '../../core/services/espaco.service';
import { Espaco } from '../../core/models/espaco.model';
@Component({ selector: 'app-espacos', imports: [CurrencyPipe, FormsModule, RouterLink], templateUrl: './espacos.html', styleUrl: './espacos.css' })
export class Espacos {
  private service = inject(EspacosService);
  private cdr = inject(ChangeDetectorRef);
  espacos: Espaco[] = [];
  busca = '';
  somenteDisponiveis = false;
  loading = true;
  errorMessage = '';
  ngOnInit(): void { this.carregar(); }
  carregar(): void {
    this.loading = true;
    this.errorMessage = '';
    this.service.getAll().pipe(finalize(() => this.cdr.markForCheck())).subscribe({
      next: data => { this.espacos = data; this.loading = false; },
      error: () => { this.errorMessage = 'Não foi possível carregar os espaços.'; this.loading = false; },
    });
  }
  get filtrados(): Espaco[] {
    const normalizar = (texto: string) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const termo = normalizar(this.busca.trim());
    return this.espacos.filter(e => (!this.somenteDisponiveis || e.disponivel) && normalizar(`${e.nome} ${e.localizacao} ${e.tipoEspaco} ${e.recursos}`).includes(termo));
  }
}
