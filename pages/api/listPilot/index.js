import axios from "axios";
import db from "../../../lib/db";

const perPage = 20;

// Rangos temporales de cilindraje mientras se confirman los definitivos.
const DISPLACEMENT_RANGES = {
  "1000-1600": { min: 1000, max: 1600 },
  "1600-2000": { min: 1600, max: 2000 },
  "2000-3000": { min: 2000, max: 3000 },
  "3000+": { min: 3000, max: null },
};

export const config = {
  api: {
    bodyParser: true,
  },
};

async function handler(req, res) {
  if (req.method === "POST") {
    const {
      priceFrom,
      priceTo,
      yearFrom,
      yearTo,
      brand,
      model,
      owner,
      homeMaintenance,
      kilometers,
      type,
      agency,
      fuel_name,
      saving_plan_order,
      color,
      license_plate,
      invoice,
      minDays,
      sort,
      kmFrom,
      kmTo,
      traction,
      displacement,
    } = req.query;

    let page = req.query.page || 1;

    // Ruta liquidación: filtra por placas aprobadas en tabla LiquidacionVehicle,
    // ordenadas de mayor a menor días en stock
    if (sort === "days_desc") {
      try {
        const limitInt = perPage;
        const offsetInt = (parseInt(page) - 1) * perPage;

        const countResult = await db.$queryRaw`
          SELECT COUNT(*) as cnt
          FROM Vehicle v
          INNER JOIN LiquidacionVehicle lv ON v.license_plate = lv.license_plate
        `;
        const totalCount = Number(countResult[0].cnt);

        const response = await db.$queryRaw`
          SELECT v.*, lv.stock_value AS stock_value, lv.bono AS bono
          FROM Vehicle v
          INNER JOIN LiquidacionVehicle lv ON v.license_plate = lv.license_plate
          ORDER BY CAST(v.days_in_stock AS UNSIGNED) DESC
          LIMIT ${limitInt} OFFSET ${offsetInt}
        `;

        return res.status(200).json({
          aditional_data: {
            page: parseInt(page),
            page_count: Math.ceil(totalCount / limitInt),
            rows_count: totalCount,
            rows_per_page: limitInt,
            rows_in_page: response.length,
            rows_remaining: totalCount - limitInt * parseInt(page),
          },
          entitydata: response,
        });
      } catch (err) {
        console.log(err);
        return res.status(404).end();
      }
    }

    const conditions = [];

    if (minDays) {
      const rows = await db.$queryRaw`
        SELECT id_record FROM Vehicle
        WHERE days_in_stock REGEXP '^[0-9]+$'
          AND CAST(days_in_stock AS UNSIGNED) >= ${parseInt(minDays)}
      `;
      const ids = rows.map((r) => r.id_record);
      conditions.push({ id_record: { in: ids } });
    }

    if (priceFrom) conditions.push({ prices: { gte: parseInt(priceFrom) } });
    if (priceTo) conditions.push({ prices: { lte: parseInt(priceTo) } });
    if (yearFrom) conditions.push({ year: { gte: parseInt(yearFrom) } });
    if (yearTo) conditions.push({ year: { lte: parseInt(yearTo) } });
    if (agency) conditions.push({ location: { equals: agency } });
    if (fuel_name) conditions.push({ fuel_name: { equals: fuel_name } });
    if (color) conditions.push({ color: { equals: color } });
    if (license_plate) conditions.push({ license_plate: { endsWith: license_plate.toString() } });
    if (saving_plan_order) conditions.push({ saving_plan_order: { equals: saving_plan_order } });
    if (brand) conditions.push({ brand: { equals: brand } });
    if (model) conditions.push({ model: { equals: model } });
    if (owner) conditions.push({ owner: { equals: 1 } });
    if (homeMaintenance) conditions.push({ home: { equals: 1 } });
    if (kilometers) conditions.push({ odometer: { lte: 10000 } });
    if (kmFrom) conditions.push({ odometer: { gte: parseInt(kmFrom) } });
    if (kmTo) conditions.push({ odometer: { lte: parseInt(kmTo) } });
    if (type) conditions.push({ type: { equals: type } });
    if (invoice) conditions.push({ factory_status: { equals: 'SI' } });
    if (traction) conditions.push({ accesories: { equals: traction } });

    // business_channel (cilindraje) se guarda como texto, por lo que el rango
    // numérico se resuelve con CAST igual que el filtro de minDays.
    if (displacement && DISPLACEMENT_RANGES[displacement]) {
      const { min, max } = DISPLACEMENT_RANGES[displacement];
      const rows =
        max != null
          ? await db.$queryRaw`
              SELECT id_record FROM Vehicle
              WHERE business_channel REGEXP '^[0-9]+$'
                AND CAST(business_channel AS UNSIGNED) >= ${min}
                AND CAST(business_channel AS UNSIGNED) <= ${max}
            `
          : await db.$queryRaw`
              SELECT id_record FROM Vehicle
              WHERE business_channel REGEXP '^[0-9]+$'
                AND CAST(business_channel AS UNSIGNED) >= ${min}
            `;
      const ids = rows.map((r) => r.id_record);
      conditions.push({ id_record: { in: ids } });
    }

    const where = conditions.length > 0 ? { AND: conditions } : {};

    try {
      const responseCount = await db.vehicle.count({ where: where });

      const response = await db.vehicle.findMany({
        where: where,
        take: perPage,
        skip: (page - 1) * perPage,
      });

      return res.status(200).json({
        aditional_data: {
          page: page,
          page_count: Math.ceil(responseCount / perPage),
          rows_count: responseCount,
          rows_per_page: perPage,
          rows_in_page: response.length,
          rows_remaining: responseCount - perPage * page,
        },
        entitydata: response,
      });
    } catch (err) {
      console.log(err);
      return res.status(404).end();
    }
  }

  return res.status(404).end();
}

export default handler;
