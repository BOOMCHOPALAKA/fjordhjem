// Availability Calendar - Displays Airbnb availability from iCal feed
class AvailabilityCalendar {
    constructor(containerId, iCalUrl) {
        this.container = document.getElementById(containerId);
        this.iCalUrl = iCalUrl;
        this.blockedDates = new Set();
        this.currentDate = new Date();
        this.init();
    }

    async init() {
        if (!this.container || !this.iCalUrl) return;

        try {
            await this.fetchBlockedDates();
            this.render();
        } catch (error) {
            console.error('Calendar error:', error);
            this.renderError();
        }
    }

    async fetchBlockedDates() {
        try {
            console.log('Fetching iCal data from:', this.iCalUrl);
            // Use a CORS proxy for the iCal feed
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(this.iCalUrl)}`;
            console.log('Using proxy URL:', proxyUrl);
            const response = await fetch(proxyUrl);
            console.log('Response status:', response.status);
            const icalData = await response.text();
            console.log('iCal data length:', icalData.length);
            console.log('First 500 chars of iCal data:', icalData.substring(0, 500));
            this.parseICalData(icalData);
            console.log('Total blocked dates found:', this.blockedDates.size);
            console.log('Sample blocked dates:', Array.from(this.blockedDates).slice(0, 10));
        } catch (error) {
            console.error('Failed to fetch iCal data:', error);
            throw error;
        }
    }

    parseICalData(icalData) {
        // Parse iCal format to extract blocked date ranges
        const events = icalData.split('BEGIN:VEVENT');
        console.log('Found', events.length - 1, 'events in iCal data');

        events.forEach((event, index) => {
            if (!event.includes('DTSTART')) return;

            const dtstart = event.match(/DTSTART[;:]([^\r\n]+)/);
            const dtend = event.match(/DTEND[;:]([^\r\n]+)/);

            if (dtstart && dtend) {
                console.log(`Event ${index}: DTSTART=${dtstart[1]}, DTEND=${dtend[1]}`);
                const startDate = this.parseICalDate(dtstart[1]);
                const endDate = this.parseICalDate(dtend[1]);
                console.log(`  Parsed as: ${startDate} to ${endDate}`);

                // Add all dates in the range as blocked
                let currentDate = new Date(startDate);
                while (currentDate <= endDate) {
                    this.blockedDates.add(this.formatDate(currentDate));
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            }
        });
    }

    parseICalDate(dateString) {
        // Parse iCal date format (YYYYMMDD or YYYYMMDDTHHMMSSZ)
        const cleaned = dateString.replace(/[;:]/g, '').trim();
        const year = cleaned.substring(0, 4);
        const month = cleaned.substring(4, 6);
        const day = cleaned.substring(6, 8);
        return new Date(year, month - 1, day);
    }

    formatDate(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    isBlocked(date) {
        return this.blockedDates.has(this.formatDate(date));
    }

    render() {
        const { year, month } = { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth() };

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];

        let html = `
            <div class="availability-calendar">
                <div class="calendar-header">
                    <button class="calendar-nav" id="prevMonth" aria-label="Previous month">‹</button>
                    <h3>${monthNames[month]} ${year}</h3>
                    <button class="calendar-nav" id="nextMonth" aria-label="Next month">›</button>
                </div>
                <div class="calendar-grid">
                    <div class="calendar-day-header">Sun</div>
                    <div class="calendar-day-header">Mon</div>
                    <div class="calendar-day-header">Tue</div>
                    <div class="calendar-day-header">Wed</div>
                    <div class="calendar-day-header">Thu</div>
                    <div class="calendar-day-header">Fri</div>
                    <div class="calendar-day-header">Sat</div>
        `;

        // Empty cells before first day
        for (let i = 0; i < startingDayOfWeek; i++) {
            html += '<div class="calendar-day empty"></div>';
        }

        // Days of the month
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isPast = date < today && this.formatDate(date) !== this.formatDate(today);
            const isBlocked = this.isBlocked(date);
            const isToday = this.formatDate(date) === this.formatDate(today);

            let classes = 'calendar-day';
            if (isPast) classes += ' past';
            else if (isBlocked) classes += ' blocked';
            else classes += ' available';
            if (isToday) classes += ' today';

            html += `<div class="${classes}">${day}</div>`;
        }

        html += `
                </div>
                <div class="calendar-legend">
                    <div class="legend-item">
                        <span class="legend-color available"></span>
                        <span>Available</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color blocked"></span>
                        <span>Booked</span>
                    </div>
                </div>
            </div>
        `;

        this.container.innerHTML = html;
        this.attachEventListeners();
    }

    attachEventListeners() {
        const prevBtn = document.getElementById('prevMonth');
        const nextBtn = document.getElementById('nextMonth');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.render();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.render();
            });
        }
    }

    renderError() {
        this.container.innerHTML = `
            <div class="calendar-error">
                <p>Unable to load availability calendar. Please check Airbnb for current availability.</p>
            </div>
        `;
    }
}

// Export for use in other scripts
window.AvailabilityCalendar = AvailabilityCalendar;
