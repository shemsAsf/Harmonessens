# Deployment Requirements & Manual Setup

⚠️ **Important Notice**
Due to the current hosting configuration, the `.env` file is **not persisted automatically** and is removed after each deploy or commit.

To ensure the application runs correctly, **manual steps are required after every deployment**.

---

## 1. `.env` File (Required After Every Deploy)

After **each deploy / commit**, you **must manually recreate** the `.env` file in the **root directory** of the project.

### Requirements

* The file **must be named exactly** `.env`
* All required environment variables must be present
* **The database host must be defined using an IPv4 address**

### Correct

```env
DB_HOST=127.0.0.1
```

### Incorrect

```env
DB_HOST=localhost
DB_HOST=::1
```

Using `localhost` or IPv6 (`::1`) will cause database connection issues.

---

## 2. Secure the `.env` File with `.htaccess`

To prevent public access to sensitive environment variables, add the following **at the very top** of your `.htaccess` file:

```apache
<Files .env>
Order allow,deny
Deny from all
</Files>
```

This ensures the `.env` file cannot be accessed from the web.

---

## 3. Restart the Application Manually

After recreating the `.env` file, the application must be restarted manually so the new environment variables are applied.

### Steps

1. Connect to the server via **SSH**
2. Run the following commands:

```sh
cd domains/harmonessens.fr/public_html/
touch tmp/restart.txt
```

This forces the server to reload the application.

---

## Deployment Checklist

After **every deploy / commit**, make sure to:

* [ ] Recreate the `.env` file in the project root
* [ ] Ensure `DB_HOST` uses an **IPv4 address**
* [ ] Protect `.env` using `.htaccess`
* [ ] Restart the application via SSH

---

## Important

If any of these steps are skipped, the application may:

* Fail to start
* Fail to connect to the database
* Expose sensitive configuration data

Always follow this procedure after each deployment.
