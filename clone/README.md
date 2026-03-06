# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Google Sheets Form Sync (separate sheet per form)

This project now supports sending submitted form entries to Google Sheets using Apps Script webhooks.

### 1) Create one Apps Script Web App per Google Sheet

- Create a Google Sheet for each form you want to manage separately.
- In each sheet: **Extensions → Apps Script**.
- Add a `doPost(e)` script that parses JSON and appends a row.
- Deploy each script as **Web App** and copy each webhook URL.

### 2) Add webhook URLs in your `.env`

Use this naming format:

```env
# fallback webhook if a specific form key is missing
VITE_GOOGLE_SHEET_WEBHOOK_DEFAULT=

# website forms
VITE_GOOGLE_SHEET_WEBHOOK_CONTACT_FORM=
VITE_GOOGLE_SHEET_WEBHOOK_CALLBACK_MODAL=

# dashboard forms (examples already used by formType)
VITE_GOOGLE_SHEET_WEBHOOK_UPLOAD_TRACK=
VITE_GOOGLE_SHEET_WEBHOOK_USER_PROFILE_PERSONAL=
VITE_GOOGLE_SHEET_WEBHOOK_USER_PROFILE_BANK=
VITE_GOOGLE_SHEET_WEBHOOK_USER_PROFILE_PAN=
VITE_GOOGLE_SHEET_WEBHOOK_USER_PASSWORD_CHANGE=
```

> The key is built from `formType` by converting to uppercase and replacing non-alphanumeric characters with `_`.

### 3) How it works

- Shared submissions via `useFormStorage().submitForm(...)` are automatically posted to Google Sheets.
- Contact page and Callback modal are also posted directly on successful submit.
- File objects are sanitized to filenames before sending.
