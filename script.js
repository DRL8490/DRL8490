// Chart configuration
const ctx = document.getElementById('tideChart').getContext('2d');
const tideChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [], // Time labels
    datasets: [{
      label: 'Tide Level (m)',
      data: [], // Tide data
      borderColor: 'blue',
      fill: false
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Tide Level (m)'
        }
      }
    }
  }
});

// Function to fetch tide data from NOAA API
async function fetchTideData() {
  const stationId = '9414290'; // Example station ID (San Francisco)
  const apiUrl = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=latest&station=${stationId}&product=water_level&units=metric&time_zone=gmt&application=web_services&format=json`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const tideData = data.data;

    // Update the chart with new data
    tideData.forEach(entry => {
      const time = new Date(entry.t).toLocaleTimeString();
      const level = parseFloat(entry.v);

      tideChart.data.labels.push(time);
      tideChart.data.datasets[0].data.push(level);

      // Keep only the last 20 data points
      if (tideChart.data.labels.length > 20) {
        tideChart.data.labels.shift();
        tideChart.data.datasets[0].data.shift();
      }
    });

    tideChart.update(); // Refresh the chart
  } catch (error) {
    console.error('Error fetching tide data:', error);
  }
}

// Fetch data every 5 minutes
setInterval(fetchTideData, 5 * 60 * 1000);
fetchTideData(); // Initial fetch