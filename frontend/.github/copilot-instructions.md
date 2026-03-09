
You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## ⚠️ MANDATORY: Angular Skills Usage

**The use of Angular skills is NOT optional — it is MANDATORY.** Before performing ANY Angular-related task, you **MUST** invoke the corresponding skill. Failing to do so is a violation of these project instructions.

| Skill | Propósito | Cuándo invocarlo |
|-------|-----------|------------------|
| `angular-component` | Crear y refactorizar componentes standalone con señales, OnPush, host bindings, content projection y lifecycle hooks. | Crear un componente nuevo, migrar inputs de clase a señales, agregar host bindings, o implementar componentes interactivos accesibles. |
| `angular-di` | Implementar inyección de dependencias con `inject()`, tokens de inyección y configuración de providers. | Crear servicios, configurar providers a distintos niveles, crear tokens inyectables, o gestionar servicios singleton vs scoped. |
| `angular-directives` | Crear directivas personalizadas para manipulación del DOM y extensión de comportamiento. | Crear comportamientos reutilizables del DOM, extender funcionalidad de elementos, o componer comportamientos con host directives. |
| `angular-forms` | Construir formularios reactivos basados en señales con el Signal Forms API. | Implementar formularios, agregar validación, crear formularios multi-paso, o formularios con campos condicionales. |
| `angular-http` | Implementar fetching de datos con `resource()`, `httpResource()` y `HttpClient`. | Llamadas a APIs, carga de datos con señales, manejo de request/response, o interceptores HTTP. |
| `angular-routing` | Implementar routing con lazy loading, guards funcionales, resolvers y parámetros de ruta. | Configurar rutas, agregar guards de autenticación, implementar lazy loading, o leer parámetros de ruta con señales. |
| `angular-signals` | Implementar gestión de estado reactivo con `signal()`, `computed()`, `linkedSignal()` y `effect()`. | Gestión de estado, convertir BehaviorSubject/Observable a señales, o implementar flujos de datos reactivos. |
| `angular-ssr` | Implementar server-side rendering e hidratación con `@angular/ssr`. | Configurar SSR, corregir hydration mismatches, pre-renderizar rutas, o hacer código compatible con SSR. |
| `angular-testing` | Escribir tests unitarios e integración con Vitest o Jasmine usando TestBed y patrones modernos. | Crear tests, testear componentes con señales, mockear dependencias, o configurar infraestructura de testing. |
| `angular-tooling` | Usar Angular CLI y herramientas de desarrollo efectivamente. | Crear proyectos, generar componentes/servicios, configurar builds, ejecutar tests, u optimizar builds de producción. |

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection
