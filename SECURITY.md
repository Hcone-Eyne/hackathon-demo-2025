# Security Policy

## Overview

DBT Prototype takes security seriously. This document outlines our security practices and how to report vulnerabilities.

## Security Features

### Authentication & Authorization

- **Supabase Authentication**: Secure user authentication with email/password
- **Row-Level Security (RLS)**: Database-level access control
- **Role-Based Access Control (RBAC)**: User roles (admin, moderator, user)
- **Session Management**: Secure session handling with automatic refresh

### Data Protection

- **Encrypted Data**: Sensitive data encrypted at rest
- **HTTPS Only**: All traffic encrypted in transit
- **Input Validation**: Client and server-side validation
- **SQL Injection Prevention**: Parameterized queries via Supabase
- **XSS Protection**: Content Security Policy enabled

### Database Security

All tables implement Row-Level Security:

```sql
-- Example RLS Policy
CREATE POLICY "Users can view their own data"
ON table_name
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
```

### Sensitive Data Handling

- **Aadhaar Numbers**: Masked in UI (XXXX-XXXX-1234)
- **Bank Details**: Partial display only (last 4 digits)
- **User Profiles**: Visible only to authenticated users
- **User Roles**: Restricted to admin access

## Security Best Practices

### For Developers

1. **Never commit secrets**: Use environment variables
2. **Validate all inputs**: Both client and server-side
3. **Use RLS policies**: Never bypass database security
4. **Review dependencies**: Regularly update packages
5. **Follow OWASP guidelines**: Web application security

### For Users

1. **Strong Passwords**: Use unique, complex passwords
2. **Enable 2FA**: When available (future feature)
3. **Verify URLs**: Always check you're on the correct domain
4. **Report Issues**: See reporting section below

## Known Limitations

1. **Mock Verification**: DBT checker uses mock data only
2. **Demo Data**: Does not connect to real government systems
3. **Prototype Status**: Not for production government use

## Security Warnings from Linter

### Addressed Issues

✅ **Public Data Exposure**: Fixed by restricting to authenticated users
✅ **Performance Indexes**: Added for improved query performance

### User Configuration Required

⚠️ **Leaked Password Protection**: Enable in Supabase dashboard
  - Go to Authentication → Settings
  - Enable "Leaked Password Protection"
  - This prevents users from using compromised passwords

## Reporting Security Issues

### DO NOT

- Open public GitHub issues for security vulnerabilities
- Share vulnerability details publicly before disclosure

### DO

1. **Email**: Report to security@yourcompany.com
2. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Your contact information
3. **Wait**: Allow us time to fix before public disclosure

### Response Timeline

- **Acknowledgment**: Within 24 hours
- **Initial Assessment**: Within 3 days
- **Fix Development**: Based on severity
  - Critical: 7 days
  - High: 14 days
  - Medium: 30 days
  - Low: 90 days

## Security Updates

### How Updates Are Distributed

- Critical patches deployed immediately
- Regular updates published on release schedule
- Security advisories posted in announcements

### Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Compliance

### Data Protection

- GDPR considerations for user data
- Data retention policies implemented
- User data deletion available
- Export functionality for user rights

### Audit Trail

- Database operations logged
- Authentication events tracked
- Admin actions recorded
- Anomaly detection enabled

## Security Checklist for Deployments

- [ ] All environment variables configured
- [ ] RLS policies applied to all tables
- [ ] Authentication properly configured
- [ ] HTTPS enforced in production
- [ ] CSP headers configured
- [ ] Rate limiting enabled
- [ ] Error messages sanitized
- [ ] Logging configured (no sensitive data)
- [ ] Backup strategy implemented
- [ ] Monitoring and alerts set up

## Additional Resources

- [Supabase Security Guide](https://supabase.com/docs/guides/auth)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Security Basics](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Lovable Security Docs](https://docs.lovable.dev/features/security)

## Contact

For security concerns:
- **Email**: security@yourcompany.com
- **Encrypted**: PGP key available on request

---

Last Updated: 2025-11-10
Version: 1.0.0
