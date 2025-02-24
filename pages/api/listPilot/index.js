import axios from "axios";
import db from "../../../lib/db";

const perPage = 20;

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
    } = req.query;

    let page = req.query.page || 1;

    let where = {};

    if (
      priceFrom !== "" &&
      priceFrom !== undefined &&
      (priceTo === "" || priceTo === undefined)
    ) {
      where.prices = {
        gte: parseInt(priceFrom),
      };
    }
    if (
      priceTo !== "" &&
      priceTo !== undefined &&
      (priceFrom === "" || priceFrom === undefined)
    ) {
      where.prices = {
        lte: parseInt(priceTo),
      };
    }

    if (
      priceFrom !== "" &&
      priceFrom !== undefined &&
      priceTo !== "" &&
      priceTo !== undefined &&
      (yearFrom === "" ||
        yearFrom === undefined ||
        yearTo === "" ||
        yearTo === undefined)
    ) {
      where = {
        AND: [
          {
            prices: { gte: parseInt(priceFrom) },
          },
          {
            prices: { lte: parseInt(priceTo) },
          },
        ],
      };
    }

    if (
      yearFrom !== "" &&
      yearFrom !== undefined &&
      (yearTo === "" || yearTo === undefined)
    ) {
      where.year = {
        gte: parseInt(yearFrom),
      };
    }
    if (
      yearTo !== "" &&
      yearTo !== undefined &&
      (yearFrom === "" || yearFrom === undefined)
    ) {
      where.year = {
        lte: parseInt(yearTo),
      };
    }

    if (
      yearFrom !== "" &&
      yearFrom !== undefined &&
      yearTo !== "" &&
      yearTo !== undefined &&
      (priceFrom === "" ||
        priceFrom === undefined ||
        priceTo === "" ||
        priceTo === undefined)
    ) {
      where = {
        AND: [
          {
            prices: { gte: parseInt(yearFrom) },
          },
          {
            prices: { lte: parseInt(yearTo) },
          },
        ],
      };
    }

    if (
      yearFrom !== "" &&
      yearFrom !== undefined &&
      yearTo !== "" &&
      yearTo !== undefined &&
      priceFrom !== "" &&
      priceFrom !== undefined &&
      priceTo !== "" &&
      priceTo !== undefined
    ) {
      where = {
        AND: [
          {
            prices: { gte: parseInt(priceFrom) },
          },
          {
            prices: { lte: parseInt(priceTo) },
          },
          {
            year: { gte: parseInt(yearFrom) },
          },
          {
            year: { lte: parseInt(yearTo) },
          },
        ],
      };
    }

    if (agency !== "" && agency !== undefined) {
      where.location = {
        equals: agency,
      };
    }

    if (fuel_name !== "" && fuel_name !== undefined) {
      where.fuel_name = {
        equals: fuel_name,
      };
    }

    if (brand !== "" && model !== undefined) {
      where.brand = {
        equals: brand,
      };
    }

    if (model !== "" && model !== undefined) {
      where.model = {
        equals: model,
      };
    }

    if (owner !== "" && owner !== undefined) {
      where.owner = {
        equals: 1,
      };
    }

    if (homeMaintenance !== "" && homeMaintenance !== undefined) {
      where.home = {
        equals: 1,
      };
    }

    if (homeMaintenance !== "" && homeMaintenance !== undefined) {
      where.home = {
        equals: 1,
      };
    }

    if (kilometers !== "" && kilometers !== undefined) {
      where.odometer = {
        lte: 10000,
      };
    }

    if (type !== "" && type !== undefined) {
      where.type = {
        equals: type,
      };
    }
    console.log('listPilot ');
    try {
      const responseCount = await db.vehicle.count({ where: where });

      const response = await db.vehicle.findMany({
        where: where,
        take: perPage,
        skip: (page - 1) * perPage,
      });
      console.log('listPilot response: ', response);

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
