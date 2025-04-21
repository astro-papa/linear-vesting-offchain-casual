# @casual/vesting-offchain

Sistema de vesting sin comisiones ni custodios, basado en Cardano.

> 🧩 Este proyecto parte del excelente trabajo realizado por el equipo de [Anastasia Labs](https://github.com/Anastasia-Labs), a quienes agradecemos por compartir su SDK original como base.  
> Esta versión ha sido adaptada para eliminar comisiones, dependencias cerradas y cualquier forma de control externo.

---

## 🎯 Objetivo

Ofrecer una implementación limpia, segura y reutilizable de un contrato de vesting para tokens en Cardano, usando Plutus V2 y Lucid, que garantice:

- 0% de comisiones
- 100% de control por parte de los beneficiarios
- 0% de dependencia en servicios o wallets externas

---

## 🚀 Características principales

| Elemento                      | Estado                                |
|------------------------------|----------------------------------------|
| **Comisiones**               | ❌ Ninguna (`PROTOCOL_FEE = 0`)         |
| **Pagos a terceros**         | ❌ Eliminados                           |
| **Llaves del protocolo**     | ❌ Eliminadas                           |
| **Custodios**                | ❌ No existen                           |
| **Contrato**                 | ✅ Inmutable (`linearVesting.plutus`)   |
| **Beneficiarios**            | ✅ Controlan y redimen desde CLI o nodo |
| **Stack técnico**            | ✅ [`lucid-cardano`](https://github.com/spacebudz/lucid), TypeScript |

---

## 🧱 Estructura del SDK

- `src/core/constants.ts`: configuración global (tiempos, fee = 0, tolerancia)
- `src/core/contract.types.ts`: definiciones de datum y redeemer
- `src/endpoints/lockVestingTokens.ts`: bloqueo de tokens en contrato
- `src/endpoints/collectVestingTokens.ts`: redención de tokens por mes
- `src/core/utils/*.ts`: utilidades matemáticas y de parsing
- `linearVesting.plutus`: validador compilado en CBOR
- `script.addr`, `validator.hash`: dirección y hash del contrato

---

## 🔐 Seguridad

Esta versión está diseñada para eliminar todo punto de control externo o riesgo de captura:

1. **Contrato compilado una sola vez**:  
   El hash (`validator.hash`) y la dirección del script (`script.addr`) deben permanecer constantes durante los 36 meses de vesting.

2. **Recompilar cambia el hash**, lo que:
   - Invalida los depósitos ya hechos.
   - Puede dejar fondos bloqueados si se usa otro archivo `.plutus`.

3. **No existen pagos automáticos a terceros**:
   - `PROTOCOL_FEE = 0`
   - Las claves del protocolo (`PROTOCOL_PAYMENT_KEY`, `STAKE_KEY`) han sido eliminadas del código.

4. **Cada beneficiario controla su flujo**:
   - Usa `cardano-cli`, Lucid o scripts locales.
   - No depende de páginas web, extensiones o dapps externas.

---

## 🛠️ Instalación

```bash
# Instala dependencias
npm install

# Compila el SDK
npm run build
