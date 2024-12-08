// js/gpxExport.js

/**
 * Escapes XML special characters in a string.
 * @param {string} str - The string to escape.
 * @returns {string} - The escaped string.
 */
function escapeXML(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// GPX Export Function
window.exportToGPX = function(filteredRoutes) {
    if (filteredRoutes.length === 0) {
        alert("No routes selected to export.");
        return;
    }

    // GPX Header with necessary namespaces
    let gpxHeader = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Best Biking Roads" xmlns="http://www.topografix.com/GPX/1/1">
`;
    // GPX Footer
    let gpxFooter = `</gpx>`;

    // Initialize GPX content with header
    let gpxContent = gpxHeader;

    // Iterate over each filtered route to create separate <trk> elements
    filteredRoutes.forEach(route => {
        // Ensure each route has a unique ID
        const routeId = route.id || `${route.country}-${route.title}`;

        // Decode the polyline to get latitude and longitude points
        const decodedPath = polyline.decode(route.polyline).map(coord => [coord[0], coord[1]]);

        // Start constructing the <trk> element for the current route
        let track = `
    <trk>
        <name>${escapeXML(route.title)}</name>
        <trkseg>
`;
        // Append each <trkpt> to the current <trkseg>
        decodedPath.forEach(point => {
            track += `            <trkpt lat="${point[0]}" lon="${point[1]}"></trkpt>\n`;
        });

        // Close the <trkseg> and <trk> tags
        track += `        </trkseg>
    </trk>
`;
        // Append the current <trk> to the GPX content
        gpxContent += track;
    });

    // Append the GPX footer
    gpxContent += gpxFooter;

    // Create a Blob from the GPX content
    const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });

    // Generate a download link and trigger the download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filtered_routes.gpx';
    a.click();

    // Clean up the object URL
    URL.revokeObjectURL(url);
};