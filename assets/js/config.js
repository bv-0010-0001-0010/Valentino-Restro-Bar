// config.js - Google Apps Script deployment URL
// After deploying your Google Apps Script, paste the deployment URL here.
window.GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxk6qci87nzgiWLu2BLfeB-JxDGCP096a8pWtUuHpD9nMqLluPiDRdaFlouZc07eufLZw/exec";

// Reservation rules consumed by assets/js/script.js
window.RESERVATION_SETTINGS = {
	slotCapacity: 70,
	openingHour24: 10,
	lastBookingHour24: 22,
	enableLiveAvailability: false,
	blockedWindows: [
		{
			scope: "today",
			start: "18:00",
			end: "21:00"
		}
	]
};
