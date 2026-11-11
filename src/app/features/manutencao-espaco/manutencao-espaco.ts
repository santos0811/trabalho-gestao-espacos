import { finalize } from 'rxjs';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EspacosService } from '../../core/services/espaco.service';
@Component({
  selector: 'app-manutencao-espaco', imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './manutencao-espaco.html', styleUrl: './manutencao-espaco.css',
})
export class ManutencaoEspaco {
  private fb = inject(FormBuilder);
  private service = inject(EspacosService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  editingId: number | null = null;
  loading = false;
  loadingData = false;
  loadFailed = false;
  errorMessage = '';
  successMessage = '';
  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.pattern(/\S/)]],
    localizacao: ['', [Validators.required, Validators.pattern(/\S/)]],
    capacidade: [1, [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]],
    recursos: ['', [Validators.required, Validators.pattern(/\S/)]],
    precoHora: [0, [Validators.required, Validators.min(0)]],
    tipoEspaco: ['', [Validators.required, Validators.pattern(/\S/)]],
    disponivel: [true],
  });
  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if (param === null) return;
    this.editingId = Number(param);
    if (!Number.isSafeInteger(this.editingId) || this.editingId <= 0) {
      this.loadFailed = true;
      this.errorMessage = 'Identificador de espaço inválido.';
      return;
    }
    this.loadingData = true;
    this.service.getById(this.editingId).pipe(finalize(() => this.cdr.markForCheck())).subscribe({
      next: espaco => { this.form.patchValue(espaco); this.loadingData = false; },
      error: () => { this.errorMessage = 'Não foi possível carregar o espaço.'; this.loadingData = false; this.loadFailed = true; },
    });
  }
  submit(): void {
    if (this.loading || this.loadingData || this.loadFailed || this.successMessage) return;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    const value = this.form.getRawValue();
    const dados = { ...value, nome: value.nome.trim(), localizacao: value.localizacao.trim(), recursos: value.recursos.trim(), tipoEspaco: value.tipoEspaco.trim() };
    const request = this.editingId === null ? this.service.create(dados) : this.service.update(this.editingId, dados);
    request.pipe(finalize(() => this.cdr.markForCheck())).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = this.editingId === null ? 'Espaço criado com sucesso!' : 'Espaço atualizado com sucesso!';
        this.form.reset();
        setTimeout(() => {
          this.router.navigate(['/admin']);
        }, 1000);
      },
      error: () => { this.loading = false; this.errorMessage = 'Não foi possível salvar. Confira a conexão e tente novamente.'; },
    });
  }
}
