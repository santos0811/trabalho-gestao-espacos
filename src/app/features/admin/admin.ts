import { finalize } from 'rxjs';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EspacosService } from '../../core/services/espaco.service';
import { Espaco } from '../../core/models/espaco.model';
@Component({ selector: 'app-admin', imports: [RouterLink, CurrencyPipe], templateUrl: './admin.html', styleUrl: './admin.css' })
export class Admin {
  private service = inject(EspacosService);
  private cdr = inject(ChangeDetectorRef);
  espacos: Espaco[] = [];
  loading = false;
  removingId: number | null = null;
  errorMessage = '';
  successMessage = '';
  ngOnInit(): void { this.loadEspacos(); }
  loadEspacos(): void {
    this.loading = true;
    this.errorMessage = '';
    this.service.getAll().pipe(finalize(() => this.cdr.markForCheck())).subscribe({
      next: data => { this.espacos = data; this.loading = false; },
      error: () => { this.errorMessage = 'Erro ao carregar os espaços.'; this.loading = false; },
    });
  }
  remove(espaco: Espaco): void {
    if (this.removingId !== null || !confirm(`Excluir o espaço "${espaco.nome}"?`)) return;
    this.removingId = espaco.id;
    this.errorMessage = '';
    this.successMessage = '';
    this.service.delete(espaco.id).pipe(finalize(() => this.cdr.markForCheck())).subscribe({
      next: () => { this.espacos = this.espacos.filter(item => item.id !== espaco.id); this.removingId = null; this.successMessage = 'Espaço excluído com sucesso.'; },
      error: () => { this.removingId = null; this.errorMessage = 'Não foi possível excluir o espaço.'; },
    });
  }
}
