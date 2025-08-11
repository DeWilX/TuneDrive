#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ANSI color codes for better terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

class EnvGenerator {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.envConfig = {};
    }

    // Utility function to colorize text
    colorize(text, color) {
        return `${colors[color]}${text}${colors.reset}`;
    }

    // Generate a secure random JWT secret
    generateJWTSecret() {
        return crypto.randomBytes(64).toString('hex');
    }

    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate URL format
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    // Validate PostgreSQL connection string
    isValidPostgresUrl(url) {
        return url.startsWith('postgresql://') || url.startsWith('postgres://');
    }

    // Prompt user for input with validation
    async prompt(question, validator = null, defaultValue = null) {
        return new Promise((resolve) => {
            const ask = () => {
                const promptText = defaultValue 
                    ? `${question} ${this.colorize(`(default: ${defaultValue})`, 'yellow')}: `
                    : `${question}: `;
                
                this.rl.question(promptText, (answer) => {
                    const value = answer.trim() || defaultValue;
                    
                    if (validator && !validator(value)) {
                        console.log(this.colorize('❌ Invalid input. Please try again.', 'red'));
                        ask();
                    } else {
                        resolve(value);
                    }
                });
            };
            ask();
        });
    }

    // Display welcome message
    displayWelcome() {
        console.clear();
        console.log(this.colorize('🚗 TuneDrive Environment Configuration Generator', 'cyan'));
        console.log(this.colorize('=' .repeat(50), 'cyan'));
        console.log('This tool will help you create a .env file for your TuneDrive project.\n');
    }

    // Database configuration section
    async configureDatabaseSection() {
        console.log(this.colorize('📁 Database Configuration', 'blue'));
        console.log(this.colorize('-'.repeat(30), 'blue'));
        
        const dbChoice = await this.prompt(
            'Choose database setup:\n1. Neon.tech (recommended)\n2. Local PostgreSQL\n3. Custom PostgreSQL URL\nEnter choice (1-3)',
            (value) => ['1', '2', '3'].includes(value),
            '1'
        );

        switch (dbChoice) {
            case '1':
                await this.configureNeonDatabase();
                break;
            case '2':
                await this.configureLocalDatabase();
                break;
            case '3':
                await this.configureCustomDatabase();
                break;
        }
    }

    // Neon database configuration
    async configureNeonDatabase() {
        console.log(this.colorize('\n🌐 Neon.tech Configuration', 'magenta'));
        console.log('Please sign up at https://neon.tech and create a new database.');
        
        const databaseUrl = await this.prompt(
            'Enter your Neon connection string (postgresql://...)',
            this.isValidPostgresUrl
        );

        // Parse the connection string to extract individual components
        const url = new URL(databaseUrl);
        
        this.envConfig.DATABASE_URL = databaseUrl;
        this.envConfig.PGHOST = url.hostname;
        this.envConfig.PGPORT = url.port || '5432';
        this.envConfig.PGUSER = url.username;
        this.envConfig.PGPASSWORD = url.password;
        this.envConfig.PGDATABASE = url.pathname.slice(1); // Remove leading slash
    }

    // Local database configuration
    async configureLocalDatabase() {
        console.log(this.colorize('\n💻 Local PostgreSQL Configuration', 'magenta'));
        
        this.envConfig.PGHOST = await this.prompt('PostgreSQL host', null, 'localhost');
        this.envConfig.PGPORT = await this.prompt('PostgreSQL port', null, '5432');
        this.envConfig.PGUSER = await this.prompt('PostgreSQL username', null, 'postgres');
        this.envConfig.PGPASSWORD = await this.prompt('PostgreSQL password');
        this.envConfig.PGDATABASE = await this.prompt('Database name', null, 'tunedrive');
        
        // Construct DATABASE_URL from components
        this.envConfig.DATABASE_URL = `postgresql://${this.envConfig.PGUSER}:${this.envConfig.PGPASSWORD}@${this.envConfig.PGHOST}:${this.envConfig.PGPORT}/${this.envConfig.PGDATABASE}`;
    }

    // Custom database configuration
    async configureCustomDatabase() {
        console.log(this.colorize('\n🔧 Custom PostgreSQL Configuration', 'magenta'));
        
        const databaseUrl = await this.prompt(
            'Enter your PostgreSQL connection string',
            this.isValidPostgresUrl
        );

        const url = new URL(databaseUrl);
        
        this.envConfig.DATABASE_URL = databaseUrl;
        this.envConfig.PGHOST = url.hostname;
        this.envConfig.PGPORT = url.port || '5432';
        this.envConfig.PGUSER = url.username;
        this.envConfig.PGPASSWORD = url.password;
        this.envConfig.PGDATABASE = url.pathname.slice(1);
    }

    // Authentication configuration
    async configureAuthSection() {
        console.log(this.colorize('\n🔐 Authentication Configuration', 'blue'));
        console.log(this.colorize('-'.repeat(30), 'blue'));
        
        const useGeneratedSecret = await this.prompt(
            'Generate a secure JWT secret automatically? (y/n)',
            (value) => ['y', 'n', 'yes', 'no'].includes(value.toLowerCase()),
            'y'
        );

        if (useGeneratedSecret.toLowerCase().startsWith('y')) {
            this.envConfig.JWT_SECRET = this.generateJWTSecret();
            console.log(this.colorize('✅ Generated secure JWT secret', 'green'));
        } else {
            this.envConfig.JWT_SECRET = await this.prompt(
                'Enter your JWT secret (minimum 32 characters)',
                (value) => value.length >= 32
            );
        }
    }

    // API configuration
    async configureApiSection() {
        console.log(this.colorize('\n🔌 CareEcu API Configuration', 'blue'));
        console.log(this.colorize('-'.repeat(30), 'blue'));
        
        const useDefaultApi = await this.prompt(
            'Use default CareEcu API configuration? (y/n)',
            (value) => ['y', 'n', 'yes', 'no'].includes(value.toLowerCase()),
            'y'
        );

        if (useDefaultApi.toLowerCase().startsWith('y')) {
            this.envConfig.CARECU_API_KEY = '5c78cfd1ca4ff97888f564558177b3e7';
            this.envConfig.CARECU_API_BASE_URL = 'https://api.carecusoft.com';
            console.log(this.colorize('✅ Using default CareEcu API configuration', 'green'));
        } else {
            this.envConfig.CARECU_API_KEY = await this.prompt('Enter CareEcu API key');
            this.envConfig.CARECU_API_BASE_URL = await this.prompt(
                'Enter CareEcu API base URL',
                this.isValidUrl,
                'https://api.carecusoft.com'
            );
        }
    }

    // Optional storage configuration
    async configureStorageSection() {
        console.log(this.colorize('\n💾 Object Storage Configuration (Optional)', 'blue'));
        console.log(this.colorize('-'.repeat(30), 'blue'));
        
        const configureStorage = await this.prompt(
            'Configure object storage for file uploads? (y/n)',
            (value) => ['y', 'n', 'yes', 'no'].includes(value.toLowerCase()),
            'n'
        );

        if (configureStorage.toLowerCase().startsWith('y')) {
            this.envConfig.DEFAULT_OBJECT_STORAGE_BUCKET_ID = await this.prompt('Bucket ID');
            this.envConfig.PUBLIC_OBJECT_SEARCH_PATHS = await this.prompt(
                'Public object search paths',
                null,
                '/bucket/public'
            );
            this.envConfig.PRIVATE_OBJECT_DIR = await this.prompt(
                'Private object directory',
                null,
                '/bucket/private'
            );
        }
    }

    // Environment configuration
    async configureEnvironment() {
        console.log(this.colorize('\n🌍 Environment Configuration', 'blue'));
        console.log(this.colorize('-'.repeat(30), 'blue'));
        
        const environment = await this.prompt(
            'Environment type:\n1. Development\n2. Production\nEnter choice (1-2)',
            (value) => ['1', '2'].includes(value),
            '1'
        );

        this.envConfig.NODE_ENV = environment === '1' ? 'development' : 'production';
        
        if (environment === '2') {
            console.log(this.colorize('⚠️  Production mode selected. Ensure all secrets are secure!', 'yellow'));
        }
    }

    // Generate the .env file content
    generateEnvContent() {
        let content = `# TuneDrive Environment Configuration
# Generated on ${new Date().toISOString()}

# Environment
NODE_ENV=${this.envConfig.NODE_ENV}

# Database Configuration
DATABASE_URL=${this.envConfig.DATABASE_URL}
PGHOST=${this.envConfig.PGHOST}
PGPORT=${this.envConfig.PGPORT}
PGUSER=${this.envConfig.PGUSER}
PGPASSWORD=${this.envConfig.PGPASSWORD}
PGDATABASE=${this.envConfig.PGDATABASE}

# JWT Secret for Admin Authentication
JWT_SECRET=${this.envConfig.JWT_SECRET}

# CareEcu API Configuration
CARECU_API_KEY=${this.envConfig.CARECU_API_KEY}
CARECU_API_BASE_URL=${this.envConfig.CARECU_API_BASE_URL}
`;

        // Add optional storage configuration if provided
        if (this.envConfig.DEFAULT_OBJECT_STORAGE_BUCKET_ID) {
            content += `
# Object Storage Configuration
DEFAULT_OBJECT_STORAGE_BUCKET_ID=${this.envConfig.DEFAULT_OBJECT_STORAGE_BUCKET_ID}
PUBLIC_OBJECT_SEARCH_PATHS=${this.envConfig.PUBLIC_OBJECT_SEARCH_PATHS}
PRIVATE_OBJECT_DIR=${this.envConfig.PRIVATE_OBJECT_DIR}
`;
        }

        return content;
    }

    // Save the .env file
    async saveEnvFile() {
        const envPath = path.join(process.cwd(), '.env');
        const envContent = this.generateEnvContent();

        // Check if .env already exists
        if (fs.existsSync(envPath)) {
            const overwrite = await this.prompt(
                '.env file already exists. Overwrite? (y/n)',
                (value) => ['y', 'n', 'yes', 'no'].includes(value.toLowerCase()),
                'n'
            );

            if (!overwrite.toLowerCase().startsWith('y')) {
                console.log(this.colorize('❌ Operation cancelled.', 'red'));
                return false;
            }

            // Backup existing .env
            const backupPath = `${envPath}.backup.${Date.now()}`;
            fs.copyFileSync(envPath, backupPath);
            console.log(this.colorize(`📋 Backed up existing .env to ${path.basename(backupPath)}`, 'yellow'));
        }

        try {
            fs.writeFileSync(envPath, envContent);
            console.log(this.colorize('✅ .env file created successfully!', 'green'));
            return true;
        } catch (error) {
            console.log(this.colorize(`❌ Error writing .env file: ${error.message}`, 'red'));
            return false;
        }
    }

    // Display next steps
    displayNextSteps() {
        console.log(this.colorize('\n🎉 Setup Complete!', 'green'));
        console.log(this.colorize('=' .repeat(30), 'green'));
        console.log('Next steps:');
        console.log('1. Review your .env file');
        console.log('2. Run: npm install');
        console.log('3. Run: npm run db:push');
        console.log('4. Run: npm run dev');
        console.log('\nYour TuneDrive application should be ready to go! 🚗💨');
    }

    // Main execution flow
    async run() {
        try {
            this.displayWelcome();
            
            await this.configureDatabaseSection();
            await this.configureAuthSection();
            await this.configureApiSection();
            await this.configureStorageSection();
            await this.configureEnvironment();
            
            console.log(this.colorize('\n📄 Configuration Summary:', 'cyan'));
            console.log(this.colorize('-'.repeat(30), 'cyan'));
            console.log(`Environment: ${this.envConfig.NODE_ENV}`);
            console.log(`Database: ${this.envConfig.PGHOST}:${this.envConfig.PGPORT}/${this.envConfig.PGDATABASE}`);
            console.log(`JWT Secret: ${'*'.repeat(20)} (generated)`);
            console.log(`API: ${this.envConfig.CARECU_API_BASE_URL}`);
            
            const confirm = await this.prompt(
                '\nDoes this look correct? (y/n)',
                (value) => ['y', 'n', 'yes', 'no'].includes(value.toLowerCase()),
                'y'
            );

            if (confirm.toLowerCase().startsWith('y')) {
                const success = await this.saveEnvFile();
                if (success) {
                    this.displayNextSteps();
                }
            } else {
                console.log(this.colorize('❌ Setup cancelled.', 'red'));
            }

        } catch (error) {
            console.log(this.colorize(`❌ Error: ${error.message}`, 'red'));
        } finally {
            this.rl.close();
        }
    }
}

// Check if running as main module
if (require.main === module) {
    const generator = new EnvGenerator();
    generator.run();
}

module.exports = EnvGenerator;