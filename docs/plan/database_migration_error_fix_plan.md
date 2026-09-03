# 🛠️ Analisis & Rencana Perbaikan: Error Migrasi Database (`make migrate`)

Dokumen ini merinci hasil audit dan analisis mendalam terhadap penyebab kegagalan saat mengeksekusi perintah `make migrate` pada backend `wahide`.

---

## 1. 🔍 Temuan Error dari `server.log`

Ketika Anda menjalankan `make migrate`, proses migrasi terhenti dengan error berikut:

```json
{"level":"trace","msg":".../migration.go:24 Error 1452 (23000): Cannot add or update a child row: a foreign key constraint fails (`wahide`.`#sql-23fc_226`, CONSTRAINT `fk_billings_invoice` FOREIGN KEY (`ref`) REFERENCES `billings` (`id`))\n[91.738ms] [rows:0] ALTER TABLE `invoices` ADD CONSTRAINT `fk_billings_invoice` FOREIGN KEY (`ref`) REFERENCES `billings`(`id`)"}
{"level":"error","msg":"AutoMigrate failed: Error 1452 (23000): Cannot add or update a child row: a foreign key constraint fails (`wahide`.`#sql-23fc_226`, CONSTRAINT `fk_billings_invoice` FOREIGN KEY (`ref`) REFERENCES `billings` (`id`))"}
```

---

## 2. 🧠 Mengapa Error 1452 Ini Terjadi? (Root Cause Analysis)

### A. Sifat Kolom `invoices.ref` yang Polimorfik
Tabel `invoices` mencatat seluruh transaksi tagihan di Wahide, baik untuk:
1. **Top-Up Saldo Deposit** $\rightarrow$ kolom `ref` diisi ID transaksi di tabel `billings` (misal: `"INV-1788194639376728100"`).
2. **Pembayaran Paket Langganan (Subscription)** $\rightarrow$ kolom `ref` diisi ID langganan di tabel `subscriptions` (misal: `"01M1HCQ0W2QGB4EYAB8EH1R6FA"`).

### B. Bukti Data di Database Anda Saat Ini
Berdasarkan pengecekan langsung ke database MySQL:
- Di tabel `invoices`, terdapat baris dengan `type = 'SUBSCRIPTION'` yang memiliki nilai `ref = "01M1HCQ0W2QGB4EYAB8EH1R6FA"`.
- Nilai `"01M1HCQ0W2QGB4EYAB8EH1R6FA"` ini **bukan ID di tabel `billings`**, melainkan ID di tabel `subscriptions`.

### C. Masalah di GORM AutoMigrate
Pada struct entity [`Billing`](file:///g:/WEB2026/wahide/internal/modules/finance/domain/entity/billing.go#L30):
```go
Invoice *Invoice `gorm:"foreignKey:Ref;references:ID;constraint:false"`
```
1. Tag `constraint:false` **bukan sintaks resmi GORM** sehingga diabaikan oleh GORM.
2. Karena opsi global `DisableForeignKeyConstraintWhenMigrating` belum diaktifkan pada konfigurasi GORM, saat `AutoMigrate` berjalan GORM secara otomatis berusaha membuat foreign key fisik di MySQL:
   ```sql
   ALTER TABLE `invoices` ADD CONSTRAINT `fk_billings_invoice` FOREIGN KEY (`ref`) REFERENCES `billings`(`id`);
   ```
3. MySQL memeriksa data tabel `invoices` yang sudah ada, menemukan ada baris invoice langganan yang `ref`-nya bukan ID billing, lalu seketika menolak query DDL tersebut dengan **MySQL Error 1452 (Foreign Key Constraint Fails)**.
4. Karena `AutoMigrate` gagal di baris 24, seluruh migrasi di bawahnya (termasuk seeder dan update constraint `dev_status_valid` untuk `HIBERNATED`) **tidak sempat dijalankan**.

---

## 3. 🛠️ Rencana Tindakan Perbaikan

### Langkah 1: Aktifkan `DisableForeignKeyConstraintWhenMigrating: true` di GORM
Di [`internal/shared/database/db.go`](file:///g:/WEB2026/wahide/internal/shared/database/db.go#L245):
```go
func connectMySQL(config DatabaseConfig, gl gormLogger.Interface) (*gorm.DB, error) {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local&sql_mode=TRADITIONAL",
		config.Username, config.Password, config.Host, config.Port, config.Database)

	return gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger:                                   gl,
		DisableForeignKeyConstraintWhenMigrating: true,
	})
}
```
*(Dan hal yang sama untuk `connectPostgreSQL`)*.

#### Manfaat Teknis:
- **Best Practice Modular Monolith**: Mencegah kegagalan migrasi akibat relasi polimorfik lintas modul.
- **Relasi Go Tetap Utuh**: Fungsi GORM seperti `Preload("Invoice")`, `Joins`, query filter tetap berfungsi normal di layer aplikasi tanpa mengunci integritas fisik tabel yang polimorfik.
- **Check Constraints & Indexes Tetap Aktif**: Index, primary key, unique index, dan CHECK constraint (seperti `dev_status_valid` dan `amount >= 0`) tetap dibuat dan berjalan sebagaimana mestinya.

### Langkah 2: Rapikan Struct Tag di `billing.go`
Di [`internal/modules/finance/domain/entity/billing.go`](file:///g:/WEB2026/wahide/internal/modules/finance/domain/entity/billing.go#L30):
Hapus tag invalid `constraint:false` menjadi:
```go
Invoice *Invoice `gorm:"foreignKey:Ref;references:ID"`
```

---

## 4. 📋 Rencana Pengujian & Verifikasi

1. **Linting Backend**:
   - Jalankan `make lint` di direktori `wahide` (`go fmt` + `golangci-lint` 0 issues).
2. **Validasi Migrasi**:
   - Anda dapat menjalankan kembali `make migrate` secara manual dan memastikan pesan sukses:
     `✅ Database migration and seeding completed successfully!`
