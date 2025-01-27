const pool = require('../config/database')

exports.VendorSearch = async (req, res) => {
    const { latitude, longitude, service } = req.query;
    
    let query = `
        SELECT DISTINCT v.*, s.name as service_name
        FROM vendors v
        JOIN vendor_services vs ON v.id = vs.vendor_id
        JOIN services s ON vs.service_id = s.id
        WHERE 1=1
    `;
    const queryParams = [];

    if (latitude && longitude) {
        query += ` AND (
            6371 * acos(
                cos(radians(?)) * cos(radians(v.latitude)) * 
                cos(radians(v.longitude) - radians(?)) + 
                sin(radians(?)) * sin(radians(v.latitude))
            ) <= 10
        )`;
        queryParams.push(latitude, longitude, latitude);
    }

    if (service) {
        query += ` AND s.name LIKE ?`;
        queryParams.push(`%${service}%`);
    }

    try {
        const [results] = await pool.execute(query, queryParams);
        res.status(200).json({
            success: true,
            Data: results
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}