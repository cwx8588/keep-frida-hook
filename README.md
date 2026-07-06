# Keep Frida Hook - SMS VerificationCodeType Enum Dump

## Purpose
Dump all enum values from `VerificationCodeType.h()` method to unlock Keep's SMS registration API.

## Background
Keep's `POST /account/v2/sms` API requires a `type` parameter whose valid values are 
encrypted by DexGuard at compile time. Static analysis cannot reveal them.

This workflow uses GitHub Actions (free tier) with hardware-accelerated Android emulator + Frida 
to dump the enum values at runtime.

## How to Use
1. Push this repo to GitHub (click "Run workflow" after push)
2. Wait ~15 minutes for the emulator to boot and Frida to hook
3. Download the **frida-results** artifact when complete
4. The output will contain all VerificationCodeType enum `h()` return values

## Files
| File | Purpose |
|------|---------|
| `.github/workflows/frida_dump.yml` | GitHub Actions workflow |
| `frida_hook.js` | Frida hook script (3 methods) |
| `README.md` | This file |

## Expected Output
```
[+] Found VerificationCodeType class
[ENUM] name=A h()=register
[ENUM] name=B h()=login
[ENUM] name=C h()=bind
[ENUM] name=D h()=reset
[ENUM] name=E h()=change
[ENUM] name=F h()=verify
```
