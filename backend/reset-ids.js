// Reset appointment IDs to start from 1
// WARNING: This will delete ALL appointments and messages!

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "database.db");
const db = new sqlite3.Database(dbPath);

console.log("⚠️  WARNING: This will delete ALL appointments and message logs!");
console.log("Press Ctrl+C to cancel, or wait 5 seconds to continue...\n");

setTimeout(() => {
  db.serialize(() => {
    // Delete all appointments
    db.run("DELETE FROM appointments", (err) => {
      if (err) {
        console.error("❌ Error deleting appointments:", err);
        return;
      }
      console.log("✅ Deleted all appointments");
    });

    // Delete all message logs
    db.run("DELETE FROM message_logs", (err) => {
      if (err) {
        console.error("❌ Error deleting message logs:", err);
        return;
      }
      console.log("✅ Deleted all message logs");
    });

    // Reset auto-increment counter
    db.run("DELETE FROM sqlite_sequence WHERE name='appointments'", (err) => {
      if (err) {
        console.error("❌ Error resetting ID counter:", err);
        return;
      }
      console.log("✅ Reset appointment ID counter");
    });

    db.run("DELETE FROM sqlite_sequence WHERE name='message_logs'", (err) => {
      if (err) {
        console.error("❌ Error resetting message ID counter:", err);
        return;
      }
      console.log("✅ Reset message ID counter");
      console.log("\n🎉 Done! Next appointment will have ID = 1");
      db.close();
    });
  });
}, 5000);
