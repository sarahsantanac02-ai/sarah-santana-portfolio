# Portafolio de Sarah Santana

Código fuente de la [landing pública de Sarah Santana](https://sarah-santana-portfolio.sarah-santanac02.chatgpt.site/), diseñadora UX/UI.

La experiencia comienza con una escena 3D y continúa en un escritorio interactivo. Los proyectos se abren como ventanas dentro de ese escritorio. El sitio está construido con Next.js, TypeScript, Tailwind CSS y React Three Fiber.

## Ejecutar localmente

Requiere Node.js y pnpm.

```bash
pnpm install
pnpm dev
```

Abre `http://127.0.0.1:43147`. Para comprobar la versión de producción:

```bash
pnpm build
```

El build estático se genera en `out/`. Ese directorio y las dependencias no se guardan en Git.

## Contenido y recursos

Los casos, imágenes y textos pertenecen al portafolio de Sarah. Los archivos de fuente Poppins conservan su licencia SIL Open Font License en `src/fonts/LICENSE.txt`; los logotipos de herramientas pertenecen a sus respectivas marcas. Este repositorio no concede una licencia general de reutilización para el contenido visual o los proyectos.

La landing está alojada en Sites. `.openai/hosting.json` conserva la vinculación con el sitio existente; publicar cambios en GitHub no actualiza automáticamente la web.
