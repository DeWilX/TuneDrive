// debug-connection.ts - Simple database connection test
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from "ws";
import dotenv from "dotenv";

// Configure Neon for serverless
neonConfig.webSocketConstructor = ws;

// Load environment variables
dotenv.config();

async function debugConnection() {
  console.log("🔧 Debug: Database Connection Test");
  console.log("==================================");

  // Check environment variables
  console.log("📋 Environment Variables Check:");
  console.log(`  DATABASE_URL exists: ${!!process.env.DATABASE_URL}`);
  console.log(`  DATABASE_URL starts with: ${process.env.DATABASE_URL?.substring(0, 20)}...`);

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set!");
    process.exit(1);
  }

  let pool: Pool | null = null;

  try {
    console.log("\n🔌 Creating connection pool...");
    pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // Force SSL for Neon
      connectionTimeoutMillis: 10000,     // 10 second timeout
      idleTimeoutMillis: 30000,           // 30 second idle timeout
      max: 1                              // Single connection for testing
    });

    console.log("✅ Pool created successfully");

    console.log("\n🧪 Testing basic query with timeout...");
    
    // Set up a timeout promise
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Query timeout after 15 seconds')), 15000)
    );
    
    // Race between query and timeout
    const queryPromise = pool.query('SELECT NOW() as current_time, version() as postgres_version');
    
    const result = await Promise.race([queryPromise, timeoutPromise]) as any;
    
    console.log("✅ Query successful!");
    console.log(`📅 Server time: ${result.rows[0].current_time}`);
    console.log(`🐘 PostgreSQL: ${result.rows[0].postgres_version.split(' ')[0]}`);

    console.log("\n📊 Testing table existence...");
    const tableCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log(`✅ Found ${tableCheck.rows.length} tables:`);
    tableCheck.rows.forEach(row => {
      console.log(`  • ${row.table_name}`);
    });

    if (tableCheck.rows.length === 0) {
      console.log("\n⚠️  No tables found! You may need to run:");
      console.log("   npm run db:push");
    }

    console.log("\n🎉 Connection test completed successfully!");

  } catch (error: any) {
    console.error("\n❌ Connection test failed:");
    console.error(`Error: ${error.message || 'Unknown error'}`);
    console.error(`Code: ${error.code || 'undefined'}`);
    console.error(`Name: ${error.name || 'undefined'}`);
    
    // Log full error for debugging
    console.error("Full error object:", JSON.stringify(error, null, 2));
    
    if (error.code === 'ENOTFOUND') {
      console.log("\n💡 Suggestions:");
      console.log("• Check your DATABASE_URL hostname");
      console.log("• Verify internet connection");
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.log("\n💡 Suggestions:");
      console.log("• Check if database server is running");
      console.log("• Verify port number in DATABASE_URL");
    }

    if (error.message.includes('password authentication failed')) {
      console.log("\n💡 Suggestions:");
      console.log("• Check username and password in DATABASE_URL");
      console.log("• Verify database credentials");
    }

    if (error.message.includes('timeout')) {
      console.log("\n💡 Suggestions:");
      console.log("• Database might be sleeping (Neon free tier)");
      console.log("• Try running the command again");
      console.log("• Check your internet connection");
    }

    // Neon-specific suggestions
    console.log("\n🌐 Neon-specific troubleshooting:");
    console.log("• Ensure your DATABASE_URL includes ?sslmode=require");
    console.log("• Check if your Neon database is in sleep mode");
    console.log("• Verify the database name and user permissions");
    
    process.exit(1);

  } finally {
    if (pool) {
      console.log("\n🔌 Closing connection...");
      await pool.end();
      console.log("✅ Connection closed");
    }
  }
}

// Run the debug
debugConnection();