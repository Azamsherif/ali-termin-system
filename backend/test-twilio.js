require('dotenv').config();
const twilio = require('twilio');

// Simple test script for Twilio SMS sending
async function testSMS() {
  try {
    console.log('🔧 Testing Twilio SMS...\n');
    
    // Verify environment variables
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      throw new Error('Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN in .env');
    }
    
    if (!process.env.TWILIO_SMS_FROM) {
      throw new Error('Missing TWILIO_SMS_FROM in .env');
    }

    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Replace with your verified phone number for testing
    const testPhone = '+41XXXXXXXXX'; // CHANGE THIS
    
    console.log(`📞 Sending test SMS to: ${testPhone}`);
    console.log(`📤 From: ${process.env.TWILIO_SMS_FROM}\n`);

    const message = await client.messages.create({
      body: '🎉 Test from Ali Termin System - Twilio is working!',
      from: process.env.TWILIO_SMS_FROM,
      to: testPhone
    });
    
    console.log('✅ Message sent successfully!');
    console.log(`📋 Message SID: ${message.sid}`);
    console.log(`📊 Status: ${message.status}`);
    console.log(`💰 Price: ${message.price} ${message.priceUnit}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 21211) {
      console.log('\n⚠️  The phone number is not verified in your Trial account.');
      console.log('Add it at: https://console.twilio.com/us1/develop/phone-numbers/manage/verified');
    }
    
    if (error.code === 21608) {
      console.log('\n⚠️  The phone number is unverified. Trial accounts can only send to verified numbers.');
    }
  }
}

testSMS();
