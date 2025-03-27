document.addEventListener('DOMContentLoaded', function() {
    fetch('pooja_timings.json')
        .then(response => response.json())
        .then(data => {
            const poojaTable = document.querySelector('#poojaTable');
            const categorizedTimings = {
                'രാവിലെ': [],
                'ഉച്ചയ്ക്ക്': [],
                'വൈകുന്നേരം': [],
                'രാത്രി': []
            };

            data.forEach(pooja => {
                const timeStr = pooja.timing.toLowerCase();
                const parts = timeStr.split(/[\s.]+/); // Split by space and/or dot
                let hour = parseInt(parts[0]);
                const minute = parseInt(parts[1]); // Extract minutes (not used for categorization but good to have)
                const ampm = parts[2];

                if (ampm === 'pm' && hour !== 12) {
                    hour += 12;
                } else if (ampm === 'am' && hour === 12) {
                    hour = 0;
                }

                if (hour >= 6 && hour < 12) {
                    categorizedTimings['രാവിലെ'].push(pooja);
                } else if (hour >= 12 && hour < 16) {
                    categorizedTimings['ഉച്ചയ്ക്ക്'].push(pooja);
                } else if (hour >= 16 && hour < 20) {
                    categorizedTimings['വൈകുന്നേരം'].push(pooja);
                } else {
                    categorizedTimings['രാത്രി'].push(pooja);
                }
            });

            // Clear the existing table body
            poojaTable.innerHTML = '';

            // Generate table sections for each category with timings
            for (const category in categorizedTimings) {
                if (categorizedTimings[category].length > 0) {
                    const thead = document.createElement('thead');
                    const headerRow = document.createElement('tr');
                    const headerCell = document.createElement('th');
                    headerCell.colSpan = 2;
                    headerCell.textContent = category;
                    headerRow.appendChild(headerCell);
                    thead.appendChild(headerRow);
                    poojaTable.appendChild(thead);

                    const tbody = document.createElement('tbody');
                    categorizedTimings[category].forEach(pooja => {
                        const row = tbody.insertRow();
                        const nameCell = row.insertCell();
                        const timingCell = row.insertCell();
                        nameCell.textContent = pooja.name_ml;
                        timingCell.textContent = pooja.timing;
                    });
                    poojaTable.appendChild(tbody);
                }
            }
        })
        .catch(error => {
            console.error('Error fetching Pooja timings:', error);
            const poojaTableBody = document.querySelector('#poojaTable tbody');
            const errorRow = poojaTableBody.insertRow();
            const errorCell = errorRow.insertCell();
            errorCell.colSpan = 2;
            errorCell.textContent = 'Failed to load Pooja timings.';
        });
});