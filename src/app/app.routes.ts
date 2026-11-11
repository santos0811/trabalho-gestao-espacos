import { Routes } from "@angular/router";
export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./features/home/home").then((m) => m.Home),
    title: "Início | WorkSpace",
  },
  {
    path: "sobre",
    loadComponent: () => import("./features/sobre/sobre").then((m) => m.Sobre),
    title: "Sobre | WorkSpace",
  },
  {
    path: "espacos",
    loadComponent: () =>
      import("./features/espacos/espacos").then((m) => m.Espacos),
    title: "Espaços | WorkSpace",
  },
  {
    path: "espacos/:id",
    loadComponent: () =>
      import("./features/detalhe-espaco/detalhe-espaco").then(
        (m) => m.DetalheEspaco,
      ),
    title: "Detalhes do espaço | WorkSpace",
  },
  {
    path: "admin",
    loadComponent: () => import("./features/admin/admin").then((m) => m.Admin),
    title: "Admin | WorkSpace",
  },
  {
    path: "admin/form",
    loadComponent: () =>
      import("./features/manutencao-espaco/manutencao-espaco").then(
        (m) => m.ManutencaoEspaco,
      ),
    title: "Novo espaço | WorkSpace",
  },
  {
    path: "admin/form/:id",
    loadComponent: () =>
      import("./features/manutencao-espaco/manutencao-espaco").then(
        (m) => m.ManutencaoEspaco,
      ),
    title: "Editar espaço | WorkSpace",
  },
  { path: "**", redirectTo: "" },
];
