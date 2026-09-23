# AWS RDS for RelayOps

Provisions PostgreSQL 16 on `db.t4g.micro` in your default VPC (Mumbai `ap-south-1` by default).

```bash
terraform init
terraform apply -var="db_password=ChangeMe_Strong_123"
```

Set Vercel `DATABASE_URL` to the sensitive `database_url` output, then run `npx vercel deploy --prod`.

Restrict `allowed_cidr` in `main.tf` to your office IP for production security.
