# Architecture

## Positioning

MeuMall Lowcode is a reusable low-code platform foundation for operation-driven pages:

- H5 activity pages
- promotion landing pages
- product topic pages
- external registration landing pages
- future mini-program pages

It is not intended to build transaction-critical pages such as order confirmation, payment, refund, wallet, or account security flows.

## Core Principle

```text
Schema is the contract.
Renderer consumes schema.
Editor produces schema.
Materials implement schema nodes.
Java config platform stores and publishes schema.
```

## Runtime Flow

```text
User opens /activity/:pageId
  -> H5 asks Java config platform for published PageSchema
  -> renderer validates schemaVersion
  -> core creates runtime context
  -> data source adapters resolve data
  -> renderer recursively renders nodes
  -> action adapters handle events
  -> telemetry reports exposure, click, and render errors
```

## Package Responsibilities

### `@meumall/lowcode-schema`

Owns the public contract:

- Page schema
- Node schema
- Material manifest
- Data source contract
- Action contract
- Validation
- Migration

### `@meumall/lowcode-core`

Framework-agnostic runtime:

- Material registry
- Node traversal
- Default props merge
- Visibility evaluation
- Data binding
- Action dispatch contracts

### `@meumall/lowcode-renderer-h5`

React H5 renderer:

- Recursive node rendering
- Material lookup
- Component-level error boundary
- Event binding
- Loading/error fallback hooks

### `@meumall/lowcode-materials-h5`

React H5 business materials:

- Activity hero
- Image banner
- Product list/grid
- Coupon section
- Countdown
- Promotion entry
- Register guide
- Rich text
- Sticky action bar

### `@meumall/lowcode-renderer-vue-h5`

Vue 3 H5 renderer:

- Recursive node rendering
- Vue material lookup
- Event binding
- Missing material fallback
- Editor preview runtime

### `@meumall/lowcode-materials-vue-h5`

Vue 3 H5 business materials:

- Section container
- Activity hero
- Image banner
- Product list
- Coupon section
- Rich text

### `@meumall/lowcode-editor`

Editor foundation:

- Editor state
- Canvas block operations
- Selection state
- Schema import/export
- Future UI shell integration

### `apps/editor-playground`

Vue3 editor playground:

- Material panel
- H5 phone preview
- Node outline
- Property inspector
- Schema JSON editor
- Local draft persistence

### `@meumall/lowcode-adapters`

Host adapters:

- Action registry
- Data source registry
- H5 navigation action
- Java API data source bridge

## Java Platform Boundary

Java config platform should own:

- Draft schema save
- Preview schema query
- Publish approval
- Published schema query
- Asset selector
- Product selector
- Coupon selector
- Activity selector
- Rollback and disable state

H5 packages only consume published or preview schema.

## Future Mini-Program Strategy

Mini-program support should reuse `schema` and `core`, then add:

```text
@meumall/lowcode-renderer-miniapp
@meumall/lowcode-materials-miniapp
```

Not every H5 material should be cross-platform. Materials must declare supported platforms.
